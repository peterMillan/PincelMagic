$(document).ready(function() {
    const $canvas = $('#drawingCanvas');
    const ctx = $canvas[0].getContext('2d');
    const $colorPicker = $('#colorPicker');
    const $eraser = $('#eraser');
    const $clearButton = $('#clear');

    function resizeCanvas() {
        $canvas[0].width = $(window).width() * 0.8;
        $canvas[0].height = $(window).height() * 0.8;
        ctx.clearRect(0, 0, $canvas[0].width, $canvas[0].height);
    }

    resizeCanvas();

    let painting = false;
    let erasing = false;
    let currentColor = '#000000';

    function getMousePos(e) {
        return {
            x: e.clientX - $canvas.offset().left,
            y: e.clientY - $canvas.offset().top
        };
    }

    function getTouchPos(touch) {
        const rect = $canvas[0].getBoundingClientRect();
        return {
            x: touch.pageX - rect.left,
            y: touch.pageY - rect.top
        };
    }

    function startPosition(e) {
        if (e.type === 'touchstart') {
            e.preventDefault(); // Evitar el desplazamiento de la página en dispositivos móviles
        }
        painting = true;
        draw(e);
    }

    function endPosition() {
        painting = false;
        ctx.beginPath();
    }

    function draw(e) {
        if (!painting) return;

        ctx.lineWidth = 5;
        ctx.lineCap = 'round';

        if (erasing) {
            ctx.strokeStyle = '#ffffff';
        } else {
            ctx.strokeStyle = currentColor;
        }

        let pos;
        if (e.type.includes('mouse')) {
            pos = getMousePos(e);
        } else if (e.type.includes('touch')) {
            pos = getTouchPos(e.touches[0]);
        }

        ctx.lineTo(pos.x, pos.y);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(pos.x, pos.y);
    }

    $canvas.on('mousedown', startPosition);
    $canvas.on('mouseup', endPosition);
    $canvas.on('mousemove', draw);

    $canvas.on('touchstart', startPosition);
    $canvas.on('touchend', endPosition);
    $canvas.on('touchmove', draw);

    $colorPicker.on('input', function(e) {
        currentColor = e.target.value;
        erasing = false;
        $eraser.text('Goma');
    });

    $eraser.on('click', function() {
        erasing = !erasing;
        $eraser.text(erasing ? 'Pintar' : 'Goma');
    });

    $clearButton.on('click', function() {
        ctx.clearRect(0, 0, $canvas[0].width, $canvas[0].height);
        currentColor = '#000000';
        $colorPicker.val(currentColor);
        erasing = false;
        $eraser.text('Goma');
    });

    $(window).on('resize', resizeCanvas);
});
