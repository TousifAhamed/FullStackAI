document.querySelectorAll('.animal-option').forEach(option => {
    option.addEventListener('click', function() {
        document.querySelectorAll('.animal-option').forEach(opt => opt.classList.remove('selected'));
        this.classList.add('selected');
        this.querySelector('input[type="radio"]').checked = true;
        
        const animal = this.querySelector('input[type="radio"]').value;
        fetch(`http://localhost:8000/animal/${animal}`)
            .then(response => response.json())
            .then(data => {
                const imgContainer = document.getElementById('animalImage');
                if (data.image_path) {
                    imgContainer.innerHTML = `<img src="${data.image_path}" alt="${animal}">`;
                } else {
                    imgContainer.innerHTML = `<p>${data.error}</p>`;
                }
                imgContainer.style.opacity = 0;
                setTimeout(() => imgContainer.style.opacity = 1, 50);
            })
            .catch(error => {
                console.error("Error fetching animal image:", error);
                const imgContainer = document.getElementById('animalImage');
                imgContainer.innerHTML = `<p>Error loading image.</p>`;
            });
    });
});

document.getElementById('fileInput').addEventListener('change', async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append('file', file);

    try {
        const response = await fetch('http://localhost:8000/upload', {
            method: 'POST',
            body: formData
        });

        const fileDetails = await response.json();
        const fileInfo = document.getElementById('fileInfo');
        if (fileDetails.error) {
            fileInfo.innerHTML = `<p>Error: ${fileDetails.error}</p>`;
        } else {
            fileInfo.innerHTML = `
                <div class="info-item"><i class="fas fa-file"></i> Name: ${fileDetails.filename}</div>
                <div class="info-item"><i class="fas fa-weight"></i> Size: ${formatFileSize(fileDetails.size)}</div>
                <div class="info-item"><i class="fas fa-file-code"></i> Type: ${fileDetails.content_type}</div>
            `;
        }
    } catch (error) {
        console.error("Error uploading file:", error);
        const fileInfo = document.getElementById('fileInfo');
        fileInfo.innerHTML = `<p>Failed to upload file.</p>`;
    }
});

function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

document.addEventListener('DOMContentLoaded', function() {
    const generateBtn = document.getElementById('generateBtn');
    const loadingOverlay = document.getElementById('loadingOverlay');
    const imagePrompt = document.getElementById('imagePrompt');
    const generatedImage = document.getElementById('generatedImage');

    generateBtn.addEventListener('click', async function() {
        const prompt = imagePrompt.value.trim();
        console.log("Prompt:", prompt);
        if (!prompt) {
            alert('Please enter a prompt');
            return;
        }

        try {
            // Show loading overlay
            loadingOverlay.style.display = 'flex';
            generateBtn.disabled = true;

            const response = await fetch('http://localhost:8000/generate-image', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ prompt: prompt })
            });
            console.log("Response Status:", response.status);

            const result = await response.json();
            console.log("Response Data:", result);

            if (response.ok) {
                if (result.image_path) {
                    // Add a timestamp to prevent caching
                    const timestamp = new Date().getTime();
                    generatedImage.innerHTML = `<img src="${result.image_path}?t=${timestamp}" alt="Generated Image">`;
                } else {
                    generatedImage.innerHTML = `<p>${result.error}</p>`;
                }
            } else {
                generatedImage.innerHTML = `<p>Error: ${result.error}</p>`;
            }
        } catch (error) {
            console.error("Error:", error);
            generatedImage.innerHTML = `<p>Unexpected error occurred.</p>`;
        } finally {
            // Hide loading overlay
            loadingOverlay.style.display = 'none';
            generateBtn.disabled = false;
        }
    });
});