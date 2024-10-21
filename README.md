# FullStackAI

## Project Overview

This project is a FastAPI application that allows users to select an animal and upload files. The application serves a static HTML file and provides endpoints for retrieving animal images and uploading files.

## Project Structure

## How to Run the Project

### Prerequisites

- Python 3.7+
- `uvicorn` ASGI server
- FastAPI framework

### Setup

1. **Clone the repository:**
    ```sh
    git clone https://github.com/TousifAhamed/FullStackAI.git
    cd FullStackAI
    ```

2. **Install the required dependencies:**
    ```sh
    pip install fastapi uvicorn
    ```

3. **Run the FastAPI application:**
    ```sh
    uvicorn main:app --reload
    ```

4. **Open your browser and navigate to:**
    ```
    http://localhost:8000
    ```

### Endpoints

- **GET `/`**: Serves the `index.html` file.
- **GET `/animal/{animal_type}`**: Returns the image path for the specified animal type (`cat`, `dog`, `elephant`).
- **POST `/upload`**: Uploads a file and returns its details (filename, size, content type).

### Static Files

- The `static` directory contains the animal images (`cat.jpg`, `dog.jpg`, `elephant.jpg`).

### Testing

- The project uses `pytest` for testing. To run the tests, use the following command:
    ```sh
    pytest
    ```

### Additional Configuration

- The `.vscode/settings.json` file is configured to use `pytest` for testing.

```json
{
    "python.testing.pytestArgs": [
        "."
    ],
    "python.testing.unittestEnabled": false,
    "python.testing.pytestEnabled": true
}
