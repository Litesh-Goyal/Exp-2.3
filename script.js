    const svg = document.getElementById('canvas');
    const colorPicker = document.getElementById('colorPicker');
    const undoBtn = document.getElementById('undoBtn');

    let drawing = false;
    let currentLine = null;
    let shapes = [];

    // Get mouse or touch coordinates in SVG space
    function getSVGPoint(evt) {
      const point = svg.createSVGPoint();
      if(evt.touches) { // touch event
        point.x = evt.touches[0].clientX;
        point.y = evt.touches[0].clientY;
      } else { // mouse event
        point.x = evt.clientX;
        point.y = evt.clientY;
      }
      return point.matrixTransform(svg.getScreenCTM().inverse());
    }

    svg.addEventListener('mousedown', startDrawing);
    svg.addEventListener('touchstart', startDrawing);

    function startDrawing(e) {
      e.preventDefault();
      const svgPoint = getSVGPoint(e);

      currentLine = document.createElementNS("http://www.w3.org/2000/svg", "line");
      currentLine.setAttribute("x1", svgPoint.x);
      currentLine.setAttribute("y1", svgPoint.y);
      currentLine.setAttribute("x2", svgPoint.x);
      currentLine.setAttribute("y2", svgPoint.y);
      currentLine.setAttribute("stroke", colorPicker.value);
      currentLine.setAttribute("stroke-width", 3);
      currentLine.setAttribute("stroke-linecap", "round");

      svg.appendChild(currentLine);
      drawing = true;
    }

    svg.addEventListener('mousemove', drawLine);
    svg.addEventListener('touchmove', drawLine);

    function drawLine(e) {
      if(!drawing || !currentLine) return;
      e.preventDefault();
      const svgPoint = getSVGPoint(e);
      currentLine.setAttribute("x2", svgPoint.x);
      currentLine.setAttribute("y2", svgPoint.y);
    }

    svg.addEventListener('mouseup', endDrawing);
    svg.addEventListener('mouseleave', endDrawing);
    svg.addEventListener('touchend', endDrawing);

    function endDrawing(e) {
      if(currentLine) {
        shapes.push(currentLine);
        currentLine = null;
      }
      drawing = false;
    }

    undoBtn.addEventListener('click', () => {
      if(shapes.length > 0) {
        const lastShape = shapes.pop();
        svg.removeChild(lastShape);
      }
    });
