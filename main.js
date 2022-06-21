import mapping from './filetypes.json' assert { type: "json" };

const input = document.querySelector('#input');

input.addEventListener('change', () => {
    
    const reader = new FileReader();
    
    const headerSize = 30;
    
    const file = input.files[0].slice(0, headerSize);
    
    reader.onload = () => {
        const values = new Uint8Array(reader.result, 0, 30);
        let mimeType = '';

        let header = [];

        for (let i = 0; i < headerSize; i++) {
            let hex = values[i].toString(16).toUpperCase();

            if (hex.length < 2) {
                hex = `0${hex}`;
            }

            header.push(hex);
        }

        Object.keys(mapping).forEach(key => {
            const type = mapping[key];

            const hexcode = type.hexcode.split(' ');

            let found = true;

            hexcode.forEach((byte, index) => {
                if (byte !== header[index + type.offset]) {
                    found = false;
                }
            });

            if (found) {
                mimeType = type.mime;
            }
        });

        console.log(mimeType);
    };

    reader.readAsArrayBuffer(file);
});

