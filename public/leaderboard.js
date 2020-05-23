            // Get the content specific to the user.
            let modal = document.getElementsByClassName("modal");

            // Get the button that opens the modal
            let btn = document.getElementsByClassName("userDisplay");

            // Get the <span> element that closes the modal
            let span = document.getElementsByClassName("close");

            // When the user clicks the button, open the modal
            for (let i = 0; i < modal.length; i++) {

              btn[i].onclick = function () {
                modal[i].style.display = "block";
              }

                // When the user clicks on <span> (x), close the modal
                span[i].onclick = function () {
                  modal[i].style.display = "none";
                }
    
                // When the user clicks anywhere outside of the modal, close it
                window.onclick = function () {
                    modal[i].style.display = "none";
                }
            }