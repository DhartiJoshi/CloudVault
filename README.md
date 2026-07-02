# CloudVault

CloudVault is a distributed cloud storage application built with Go and React. It allows users to upload, download, search, and delete files through a web interface while storing data across a peer-to-peer network.

The project was built to explore distributed systems, peer-to-peer networking, REST APIs, and full-stack development.

## Features

- Distributed file storage
- Secure file upload
- File download
- File deletion
- Real-time file search
- Persistent metadata after backend restart
- Dynamic dashboard showing storage usage, total files, and active nodes
- Responsive React interface built with Tailwind CSS

## How it Works

Unlike traditional cloud storage systems that rely on a single server, CloudVault stores files across multiple peer nodes.

When a file is uploaded, the React frontend sends it to the Go backend through a REST API. The backend stores the file in the distributed storage network and updates the metadata so the dashboard reflects the latest files.

When a user downloads a file, the backend locates it in the network and streams it back to the frontend.

Deleting a file removes its metadata and immediately refreshes the dashboard.

## Backend

The backend is built around a distributed storage engine written in Go.

Some of the core concepts used are:

- Peer-to-peer networking
- Content Addressable Storage (CAS)
- TCP communication between nodes
- File encryption
- Bootstrap nodes for peer discovery
- Distributed file replication

## Tech Stack

**Frontend**

- React
- JavaScript
- Tailwind CSS
- Axios

**Backend**

- Go
- REST APIs
- TCP Networking
- Peer-to-Peer Architecture
- Content Addressable Storage (CAS)

## Running the Project

Clone the repository

```bash
git clone https://github.com/DhartiJoshi/CloudVault.git
cd CloudVault
```

Start the backend

```bash
go run ./cmd
```

Start the frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on:

```
http://localhost:5173
```

Backend API runs on:

```
http://localhost:8080
```

## API Endpoints

| Method | Endpoint | Description |
| ------ | -------- | ----------- |
| GET | `/files` | List uploaded files |
| POST | `/upload` | Upload a file |
| GET | `/download?name=<filename>` | Download a file |
| DELETE | `/delete?name=<filename>` | Delete a file |

## License

This project is licensed under the MIT License. See the `LICENSE` file for details.

## Acknowledgments

The distributed storage engine used in this project is based on the open-source work of **Yigit Hankarabulut**, inspired by the distributed systems tutorials by **Anthony GG**.

I extended the project by developing a React frontend, integrating REST APIs, adding persistent metadata, implementing file upload, download, delete, and search functionality, and building a responsive dashboard for file management.
