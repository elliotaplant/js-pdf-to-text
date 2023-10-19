function loadPdf() {
    const fileInput = document.getElementById('pdf-file');
    const file = fileInput.files[0];

    if (file) {
        const fileReader = new FileReader();
        fileReader.onload = function (event) {
            const typedArray = new Uint8Array(event.target.result);

            const loadingTask = pdfjsLib.getDocument({ data: typedArray });
            loadingTask.promise.then(pdf => {
                const { numPages } = pdf;
                let currentPage = 1;
                let textContent = '';

                function getNextPage() {
                    pdf.getPage(currentPage).then(page => {
                        page.getTextContent().then(text => {
                            text.items.forEach(item => {
                                textContent += item.str + ' ';
                            });

                            if (currentPage < numPages) {
                                currentPage++;
                                getNextPage();
                            } else {
                                document.getElementById('pdf-text-content').innerText = textContent;
                            }
                        });
                    });
                }

                getNextPage();
            });
        };

        fileReader.readAsArrayBuffer(file);
    } else {
        alert('Please select a PDF file.');
    }
}

