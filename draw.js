paper.install(window);


Path.prototype.applyBrush = function(brush) {
  Object.assign(this, brush);
  this.strokeColor.alpha = brush.strokeOpacity;
  this.fillColor.alpha = brush.fillOpacity;
};

window.onload = () => {
  paper.setup(document.getElementById('paperCanvas'));
  let paths = {};
  let brush = new Tool();
  let theta = 0;

  brush.onMouseDown = (e) => {
    let brush = {
      strokeColor: document.getElementById('strokeColorSelector').value,
      strokeOpacity: document.getElementById('strokeOpacity').value,
      fillColor: document.getElementById('fillColorSelector').value,
      fillOpacity: document.getElementById('fillOpacity').value,
      strokeWidth: Number.parseInt(document.getElementById('brushWidth').value),
      closed: true,
    };

    let mouse = new Path();
    mouse.applyBrush(brush);
    mouse.add(e.point);
    paths.mouse = mouse;

    let xMirror = new Path();
    xMirror.applyBrush(brush);
    xMirror.add([view.size.width - e.point.x, e.point.y]);
    paths.xMirror = xMirror;

    let yMirror = new Path();
    yMirror.applyBrush(brush);
    yMirror.add([e.point.x, view.size.height - e.point.y]);
    paths.yMirror = yMirror;

    let xyMirror = new Path();
    xyMirror.applyBrush(brush);
    xyMirror.add([view.size.width - e.point.x, view.size.height - e.point.y]);
    paths.xyMirror = xyMirror;
  }

  brush.onMouseDrag = (e) => {
    theta += 0.2;
    let orbit = e.point;
    let point = new Point();
    orbit.x += 20 * Math.cos(theta);
    orbit.y += 20 * Math.sin(theta);
    point.x = orbit.x + 40 * Math.cos(theta);
    point.y = orbit.y + 40 * Math.cos(theta);

    if (point.getDistance(paths.mouse.lastSegment.point) > 10) {
      paths.mouse.add(point);
      paths.mouse.smooth();

      paths.xMirror.add([view.size.width - point.x, point.y]);
      paths.xMirror.smooth();

      paths.yMirror.add([point.x, view.size.height - point.y]);
      paths.yMirror.smooth();

      paths.xyMirror.add([view.size.width - point.x, view.size.height - point.y]);
      paths.xyMirror.smooth();
    }
  }

  brush.onMouseUp = (e) => {
    paths.mouse.simplify();
    paths.xMirror.simplify();
    paths.yMirror.simplify();
    paths.xyMirror.simplify();
  }

  view.onFrame = () => {
  }

  document.getElementById('clearCanvas').addEventListener('click', (e) => {
    e.preventDefault();
    let paths = paper.projects[0].layers[0].children;
    console.log(paths);
    while (paths.length) {
      paths.pop().remove();
    }
  });
};
