function routing(path) {
  var list = [];
  switch (path) {
    case "12":
    case "21":
      list = [Route1, Route3, Route5];
      list.forEach((el) => {
        el.count++;
        console.log(el);
      });
      break;

    case "13":
    case "31":
      list = [Route2, Route3, Route5];
      list.forEach((el) => {
        el.count++;
        console.log(el);
      });
      break;

    case "23":
    case "32":
      list = [Route4, Route6, Route7];
      list.forEach((el) => {
        el.count++;
        console.log(el);
      });
      break;
    default:
      console.log("Invalid Path");
      break;
  }
}

class Route1 {
  count = 0;
}

class Route2 {
  count = 0;
}

class Route3 {
  count = 0;
}

class Route4 {
  count = 0;
}

class Route5 {
  count = 0;
}

class Route6 {
  count = 0;
}

class Route7 {
  count = 0;
}

class Route8 {
  count = 0;
}

class Route9 {
  count = 0;
}

class Route10 {
  count = 0;
}
