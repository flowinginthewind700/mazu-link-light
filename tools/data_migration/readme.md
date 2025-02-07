# SQLite to MySQL Converter

Convert SQLite databases to MySQL SQL dump files using this Python script. This tool offers the ability to export both table structures and data, and allows customization of MySQL table options such as engine, character set, and collation.

## Features

- Convert SQLite database files to MySQL SQL dump files
- Option to export table structures only, data only, or both
- Customize MySQL table options such as engine, character set, and collation
- Automatically handle Ctrl+C interruptions for graceful termination

## Prerequisites

- Python 3.x
- SQLite and MySQL databases

## Usage

1. Clone the repository:

```
git clone https://github.com/majidalavizadeh/sqlite-to-mysql.git
```

2. Navigate to the project directory:

```
cd sqlite-to-mysql
```

3. Run the converter script:

```
python export.py <sqlite_db_file> [mysql_dump_file] [options]
```

- `<sqlite_db_file>`: Path to the SQLite database file.
- `[mysql_dump_file]` (Optional): Path to the output MySQL SQL dump file.
  If not provided, the SQLite database with .sql extension will be used as the default.

Options:

- `--engine=ENGINE`: (Optional) MySQL engine for table. Default: InnoDB.
- `--charset=CHARSET`: (Optional) MySQL character set for table. Default: utf8mb4.
- `--collate=COLLATE`: (Optional) MySQL collation for table. Default: utf8mb4_unicode_ci.
- `--no-drop`: (Optional) Do not include the "DROP TABLE IF EXISTS" syntax in SQL dump.

## Examples

- Convert SQLite to MySQL with default options:

```
python export.py input.db
```

- Convert SQLite to MySQL with custom MySQL options:

```
python export.py input.db output.sql --engine=MyISAM --charset=utf8 --collate=utf8_general_ci
```

- Convert SQLite to MySQL, without drop table syntax:

```
python export.py input.db output.sql --no-drop
```
