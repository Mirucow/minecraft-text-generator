async function generate() {
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const fontSize = Number(document.getElementById('fontSize').value);
    const width = Number(document.getElementById('width').value);
    const linePaddingSize = Number(document.getElementById('linePaddingSize').value);
    const paddingSize = Number(document.getElementById('paddingSize').value);
    const textColor = document.getElementById('textColor').value;
    const backgroundColor = document.getElementById('backgroundColor').value;
    const isLineBreakWordCount = document.getElementById('isLineBreakWordCount').checked;
    const isLineBreakWidth = document.getElementById('isLineBreakWidth').checked;
    const lineBreakWordCount = Number(document.getElementById('lineBreakWordCount').value);
    const lineBreakWidth = Number(document.getElementById('lineBreakWidth').value);
    const name = document.getElementById('name').value;
    const message = document.getElementById('message').value;

    const mojangles = await new FontFace('mojangles', 'url(./fonts/mojangles.otf)').load();
    const unifont = await new FontFace('unifont', 'url(./fonts/unifont.otf)').load();

    document.fonts.add(mojangles);
    document.fonts.add(unifont);

    ctx.font = `${fontSize}px mojangles, unifont`;

    let lines = message.split('\n');

    if (isLineBreakWordCount) {
        lines = lines.flatMap(line => {
            if (line.length <= lineBreakWordCount) {
                return [line];
            } else {
                const newLines = [];
                let newLine = '';
                for (const word of line) {
                    if (newLine.length + word.length <= lineBreakWordCount) {
                        newLine += word;
                    } else {
                        newLines.push(newLine);
                        newLine = word;
                    }
                }
                newLines.push(newLine);
                return newLines;
            }
        });
    } else if (isLineBreakWidth) {
        lines = lines.flatMap(line => {
            if (ctx.measureText(line).width <= lineBreakWidth) {
                return [line];
            } else {
                const newLines = [];
                let newLine = '';
                for (const char of line) {
                    if (ctx.measureText(newLine + char).width <= lineBreakWidth) {
                        newLine += char;
                    } else {
                        newLines.push(newLine);
                        newLine = char;
                    }
                }
                newLines.push(newLine);
                return newLines;
            }
        });
    }

    canvas.height = fontSize + paddingSize * 2 + (fontSize + linePaddingSize) * (lines.length > 1 ? lines.length : 0) + 5;
    canvas.width = width + paddingSize * 2;

    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.font = `${fontSize}px mojangles, unifont`;
    ctx.fillStyle = textColor;
    if (lines.length === 1) {
        ctx.fillText(`<${name}> ${lines[0]}`, paddingSize, fontSize + paddingSize);
    } else {
        ctx.fillText(`<${name}>`, paddingSize, fontSize + paddingSize);
        lines.forEach((line, index) => {
            ctx.fillText(line, paddingSize, fontSize + paddingSize + (fontSize + linePaddingSize) * (index + 1));
        });
    }

    const element = document.documentElement;
    const bottom = element.scrollHeight - element.clientHeight;
    window.scroll(0, bottom);
}