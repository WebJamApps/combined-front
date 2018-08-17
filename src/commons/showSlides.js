exports.showSlides = function showSlides(idArray) {
  idArray.forEach((id) => {
    // let slides;
    const slides = document.getElementById(id);
    if (slides !== null) {
      $(`#${id} > div:first`)
        .hide()
        .next()
        .fadeIn(1500)
        .end()
        .appendTo(`#${id}`);
    }
  });
};
