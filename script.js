const fileInput = document.getElementById('fileInput');
const uploadArea = document.getElementById('uploadArea');
const sidebar = document.getElementById('sidebar');

// Initialize PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.worker.min.js';

// Handle drag and drop
uploadArea.addEventListener('dragover', (e) => {
    e.preventDefault();
    uploadArea.style.borderColor = 'blue';
});
uploadArea.addEventListener('dragleave', () => {
    uploadArea.style.borderColor = '#aaa';
});
uploadArea.addEventListener('drop', (e) => {
    e.preventDefault();
    uploadArea.style.borderColor = '#aaa';
    const files = e.dataTransfer.files;
    if (files.length && files[0].type === 'application/pdf') {
        processPDF(files[0]);
    } else {
        alert('Please upload a valid PDF file.');
    }
});

// Handle file input
fileInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file && file.type === 'application/pdf') {
        processPDF(file);
    } else {
        alert('Please upload a valid PDF file.');
    }
});

// Process PDF file
async function processPDF(file) {
    const pdfData = await file.arrayBuffer();
    const pdfDoc = await pdfjsLib.getDocument(pdfData).promise;
    sidebar.innerHTML = ''; // Clear previous content

    for (let i = 1; i <= pdfDoc.numPages; i++) {
        const page = await pdfDoc.getPage(i);
        renderPage(page, i);
    }
}

// Render individual page
async function renderPage(page, pageNumber) {
    const viewport = page.getViewport({ scale: 1.5 }); // Larger scale for readability
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    canvas.height = viewport.height;
    canvas.width = viewport.width;

    // Render page into canvas
    await page.render({ canvasContext: context, viewport: viewport }).promise;

    // Create a container for the page
    const pageContainer = document.createElement('div');
    pageContainer.classList.add('page-container');
    pageContainer.appendChild(canvas);

    // Create download button
    const downloadLink = document.createElement('a');
    downloadLink.href = canvas.toDataURL('image/png');
    downloadLink.download = `page-${pageNumber}.png`;
    downloadLink.classList.add('download-button');
    downloadLink.textContent = `Download Page ${pageNumber}`;
    pageContainer.appendChild(downloadLink);

    sidebar.appendChild(pageContainer);
}
