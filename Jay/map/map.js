let startPoint = null;
let endPoint = null;
console.log(`start point : ${startPoint}`);
console.log(`end point : ${endPoint}`);

$("#1").click(function () {
  clickEvent(this.id);
});

$("#2").click(function () {
  clickEvent(this.id);
});

$("#3").click(function () {
  clickEvent(this.id);
});

$("#find").click(function () {
  const path = "" + startPoint + endPoint;
  routing(path);
});

function clickEvent(id) {
  if (startPoint == null) {
    startPoint = id;
    console.log(`start point : ${startPoint}`);
    console.log(`end point : ${endPoint}`);
  } else if (endPoint == null && startPoint != id) {
    endPoint = id;
    console.log(`start point : ${startPoint}`);
    console.log(`end point : ${endPoint}`);
  } else if (startPoint != null && endPoint != null) {
    startPoint = id;
    endPoint = null;
    console.log(`start point : ${startPoint}`);
    console.log(`end point : ${endPoint}`);
  }
}
