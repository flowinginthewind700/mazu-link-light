import React from 'react';
import Image from 'next/image';

interface AuthorInfoProps {
  author?: {
    name: string;
    avatar?: { url: string };
    twitter?: string;
  };
  createdAt: string;
}

const AuthorInfo: React.FC<AuthorInfoProps> = ({ author, createdAt }) => {
  if (author) {
    const avatarUrl = author.avatar?.url
      ? `${process.env.NEXT_PUBLIC_CMS_API_BASE_URL}${author.avatar.url}`
      : '/images/defaultavatar.jpg';

    return (
      <div className="flex items-center mt-4">
        <Image
          src={avatarUrl}
          alt={author.name}
          width={40}
          height={40}
          className="rounded-full mr-3"
        />
        <div>
          <p className="font-semibold">{author.name}</p>
          <p className="text-gray-500">
            {new Date(createdAt).toLocaleDateString()}
            {author.twitter && (
              <>
                {' • '}
                <a
                  href={`https://twitter.com/${author.twitter}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:underline"
                >
                  Follow on Twitter
                </a>
              </>
            )}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-4">
      <p className="text-gray-500">{new Date(createdAt).toLocaleDateString()} from llmstock.com</p>
    </div>
  );
};

export default AuthorInfo;
