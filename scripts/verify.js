document.querySelector(".btn-submit").addEventListener("click", function () {

  var email = localStorage.getItem('gmail')
  var inputs = document.querySelectorAll(".otp-group input");
  var otp = "";
  inputs.forEach(function(input){
    otp += input.value;
  });
  var xhr = new XMLHttpRequest()
  xhr.open("POST", "https://server.coffee.intelakah.com/api/auth/verify")
  xhr.setRequestHeader("Content-Type", "application/json")

  xhr.send(JSON.stringify({ email , otp }))

  xhr.onload = function () {

    var res = xhr.response;
    var data = JSON.parse(res)

    if (data.message == "Invalid OTP") {
      alert("Invalid OTP");
    } else {
      window.location.href = "order.html"
    }

  }

})
var inputs = document.querySelectorAll(".otp-group input")

inputs.forEach(function(input, index) {

  input.addEventListener("input", function() {

    if (input.value.length == 1 && index < inputs.length - 1) {
      inputs[index + 1].focus();
    }

  })

  input.addEventListener("keydown", function(e) {

    if (e.key == "Backspace" && input.value == "" && index > 0) {
      inputs[index - 1].focus();
    }

  })

})