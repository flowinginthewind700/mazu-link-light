"use client";

import React, { useState, useEffect, useRef } from "react";
import { getFilesAndFolders, getObject, getTags } from "@/services/cosService";
import { config } from "@/config";
import * as Dialog from '@radix-ui/react-dialog';
import { InfoCircledIcon } from '@radix-ui/react-icons';
import { Navigation } from '@/components/navigation'
import { BottomNavbar } from '@/components/bottom-navbar'

const CURRENT_PATH_KEY = 'cosExplorerCurrentPath';

export default function ResourcesPage() {
  const [resources, setResources] = useState<any[]>([]);
  const [currentPath, setCurrentPath] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(CURRENT_PATH_KEY) || config.rootDirectory;
    }
    return config.rootDirectory;
  });
  const [selectedResource, setSelectedResource] = useState<any>(null);
  const [tags, setTags] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [showImagePreview, setShowImagePreview] = useState(false);
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const imageRef = useRef<HTMLImageElement>(null);
  const [directoryCoverMap, setDirectoryCoverMap] = useState<Record<string, string>>({});

  useEffect(() => {
    fetchResources(currentPath);
    fetchDirectoryCovers();
  }, [currentPath]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(CURRENT_PATH_KEY, currentPath);
    }
  }, [currentPath]);

  const fetchResources = async (path: string) => {
    try {
      const data = await getFilesAndFolders(path);
      console.log('Fetched resources:', data);
      const filteredData = Array.isArray(data) ? data.filter(resource => 
        isFolder(resource) || isImageFile(resource.Key)
      ) : [];
      console.log('Filtered resources:', filteredData);
      setResources(filteredData);
    } catch (error) {
      console.error("Failed to fetch resources:", error);
      setResources([]);
    }
  };

  const fetchDirectoryCovers = async () => {
    try {
      const response = await getObject('directory_covers.json');
      if (response && response.Body) {
        try {
          const bodyText = response.Body.toString();
          const coverMap = JSON.parse(bodyText);
          if (typeof coverMap === 'object' && coverMap !== null) {
            setDirectoryCoverMap(coverMap);
          } else {
            console.error("Invalid directory_covers.json format");
            setDirectoryCoverMap({});
          }
        } catch (parseError) {
          console.error("Failed to parse directory_covers.json:", parseError);
          setDirectoryCoverMap({});
        }
      } else {
        console.warn("directory_covers.json is empty or not found");
        setDirectoryCoverMap({});
      }
    } catch (error) {
      console.error("Failed to fetch directory covers:", error);
      setDirectoryCoverMap({});
    }
  };

  const handleResourceClick = async (resource: any) => {
    if (isFolder(resource)) {
      setCurrentPath(resource.Prefix);
    } else if (isImageFile(resource.Key)) {
      setSelectedResource(resource);
      setShowImagePreview(true);
      setScale(1);
      setPosition({ x: 0, y: 0 });
    }
  };

  const handleInfoClick = async (resource: any, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const tagsData = await getTags(resource.Key || resource.Prefix);
      setTags(Array.isArray(tagsData.TagSet) ? tagsData.TagSet : []);
      setSelectedResource(resource);
      setShowModal(true);
    } catch (error) {
      console.error("Failed to fetch tags:", error);
      setTags([]);
    }
  };

  const isImageFile = (filename: string) => {
    return /\.(gif|jpe?g|tiff?|png|webp|bmp)$/i.test(filename);
  };

  const isFolder = (resource: any) => {
    return !!resource.Prefix;
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY * -0.01;
    setScale(prevScale => Math.max(0.1, Math.min(5, prevScale + delta)));
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
    setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      setPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const getBreadcrumbs = () => {
    const parts = currentPath.replace(config.rootDirectory, '').split('/').filter(Boolean);
    let path = config.rootDirectory;
    return [
      { name: 'Root', path: config.rootDirectory },
      ...parts.map(part => {
        path += `${part}/`;
        return { name: part, path };
      })
    ];
  };

  const handleBreadcrumbClick = (path: string) => {
    setCurrentPath(path);
  };

  const getResourceCover = (resource: any): string | undefined => {
    if (isFolder(resource)) {
      const directoryPath = resource.Prefix.slice(0, -1); // Remove trailing slash
      if (directoryCoverMap[directoryPath]) {
        return `${config.cosBaseUrl}/${directoryCoverMap[directoryPath]}`;
      }
      // Check if _cover.jpg exists in the folder
      const coverImage = `${directoryPath}_cover.jpg`;
      const foundCover = resources.find(item => item.Key === coverImage);
      if (foundCover) {
        return `${config.cosBaseUrl}/${coverImage}`;
      }
      // Use default folder icon
      return undefined;
    } else {
      return `${config.cosBaseUrl}/${resource.Key}`;
    }
  };

  const shouldDisplayResource = (resource: any) => {
    return isFolder(resource) || !resource.Key.endsWith('_cover.jpg');
  };

  return (
    <><Navigation
    currentPage=""
    showMobileMenu={false}
  />
    <div className="p-4 pb-24 bg-white dark:bg-gray-900 text-black dark:text-white min-h-screen">
      <h1 className="text-3xl font-bold mb-4">Resources</h1>
      <div className="mb-4 flex flex-wrap items-center">
        {getBreadcrumbs().map((crumb, index) => (
          <React.Fragment key={crumb.path}>
            {index > 0 && <span className="mx-2">/</span>}
            <button 
              onClick={() => handleBreadcrumbClick(crumb.path)}
              className="text-blue-500 hover:underline"
            >
              {crumb.name}
            </button>
          </React.Fragment>
        ))}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {resources.filter(shouldDisplayResource).map((resource, index) => (
          <div 
            key={index} 
            className="relative group"
          >
            <div 
              onClick={() => handleResourceClick(resource)}
              className="aspect-square w-full overflow-hidden rounded-lg cursor-pointer hover:opacity-90 transition duration-300 relative"
            >
              {isFolder(resource) ? (
                <div className="relative w-full h-full flex items-center justify-center bg-gray-100 dark:bg-gray-800">
                  <svg className="absolute inset-0 w-full h-full text-gray-400 dark:text-gray-500 opacity-30" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M10 4H4a2 2 0 00-2 2v12a2 2 0 002 2h16a2 2 0 002-2V8a2 2 0 00-2-2h-8l-2-2z" />
                  </svg>
                  {getResourceCover(resource) && (
                    <img 
                      src={getResourceCover(resource)} 
                      alt={resource.Prefix} 
                      className="object-cover z-10"
                      style={{
                        width: '50%',
                        height: '53%',
                        objectFit: 'cover',
                        position: 'absolute',
                        top: '54%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)'
                      }}
                    />
                  )}
                </div>
              ) : (
                <img 
                  src={getResourceCover(resource)} 
                  alt={resource.Key} 
                  className="w-full h-full object-cover" 
                />
              )}
            </div>
            <div className="absolute bottom-0 left-0 right-0 p-2 bg-black bg-opacity-50 text-white">
              <p className="truncate text-sm">
                {isFolder(resource) 
                  ? resource.Prefix.split('/').slice(-2)[0] 
                  : resource.Key.split('/').pop()}
              </p>
            </div>
            <button 
              onClick={(e) => handleInfoClick(resource, e)}
              className="absolute top-2 right-2 p-1 bg-white dark:bg-gray-800 rounded-full shadow-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-300 z-20"
            >
              <InfoCircledIcon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            </button>
          </div>
        ))}
      </div>

      {showModal && selectedResource && (
        <Dialog.Root open={showModal} onOpenChange={setShowModal}>
          <Dialog.Overlay className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-30" />
          <Dialog.Content className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white dark:bg-gray-800 p-6 rounded-lg max-w-md w-full shadow-xl backdrop-filter backdrop-blur-lg bg-opacity-90 dark:bg-opacity-90 z-40">
            <Dialog.Title className="text-xl font-bold mb-4 truncate">
              {isFolder(selectedResource) 
                ? selectedResource.Prefix.split('/').slice(-2)[0] 
                : selectedResource.Key.split('/').pop()}
            </Dialog.Title>
            <div className="space-y-2">
              {tags.map((tag, index) => (
                <div key={index} className="flex justify-between items-center bg-gray-100 dark:bg-gray-700 p-2 rounded">
                  <span className="font-semibold truncate mr-2">{tag.Key}</span>
                  <span className="truncate text-gray-600 dark:text-gray-400">{tag.Value}</span>
                </div>
              ))}
            </div>
            <Dialog.Close asChild>
              <button className="absolute top-2 right-2 text-2xl font-bold text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
                ×
              </button>
            </Dialog.Close>
          </Dialog.Content>
        </Dialog.Root>
      )}

      {showImagePreview && selectedResource && (
        <Dialog.Root open={showImagePreview} onOpenChange={setShowImagePreview}>
          <Dialog.Overlay className="fixed inset-0 bg-black bg-opacity-75 dark:bg-opacity-90 z-30" />
          <Dialog.Content 
            className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 p-4 rounded-lg overflow-hidden z-40"
            style={{
              width: '80vw',
              height: '80vh',
              maxHeight: '80%',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              backdropFilter: 'blur(10px)',
              backgroundColor: 'rgba(255, 255, 255, 0.3)',
            }}
          >
            <div 
              className="relative w-full h-full overflow-hidden bg-white bg-opacity-20 dark:bg-gray-800 dark:bg-opacity-20 rounded-lg"
              onWheel={handleWheel}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              style={{
                cursor: isDragging ? 'grabbing' : 'grab',
              }}
            >
              <img 
                ref={imageRef}
                src={`${config.cosBaseUrl}/${selectedResource.Key}`} 
                alt={selectedResource.Key} 
                style={{
                  transform: `scale(${scale}) translate(${position.x}px, ${position.y}px)`,
                  transition: isDragging ? 'none' : 'transform 0.1s',
                  maxWidth: 'none',
                  maxHeight: 'none',
                }}
                className="w-full h-full object-contain"
                draggable="false"
              />
            </div>
            <Dialog.Close asChild>
              <button 
                className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center bg-white dark:bg-gray-800 text-black dark:text-white rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none"
                style={{
                  zIndex: 50
                }}
              >
                ×
              </button>
            </Dialog.Close>
          </Dialog.Content>
        </Dialog.Root>
      )}
    </div>
    <BottomNavbar />
    </>
  );
}
