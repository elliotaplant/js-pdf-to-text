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

                function getNextPage() {
                    pdf.getPage(currentPage).then(page => {
                        page.getTextContent().then(text => {
                            let lastY, textLine = '';

                            text.items.forEach(item => {
                                const { transform, str } = item;
                                const x = transform[4];
                                const y = transform[5];

                                if (lastY === undefined) lastY = y;

                                console.log('textLine', textLine);
                                console.log('x', x, str);
                                // Newline if new Y is found
                                if (Math.abs(lastY - y) > 3) {
                                    document.getElementById('pdf-text-content').innerText += textLine + '\n';
                                    textLine = '';
                                    lastY = y;
                                }

                                // Adding spaces based on X distance
                                const spacing = 5;
                                const spacesToAdd = Math.round((x - (textLine.length * spacing)) / spacing);
                                if (spacesToAdd > 0) textLine += ' '.repeat(spacesToAdd);

                                textLine += str;
                            });

                            document.getElementById('pdf-text-content').innerText += textLine + '\n';

                            if (currentPage < numPages) {
                                currentPage++;
                                getNextPage();
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
