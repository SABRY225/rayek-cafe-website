document.getElementById("btnSubmit").addEventListener("click", function () {

var emailsend = document.getElementById("email").value

var xhr = new XMLHttpRequest()

xhr.open("POST", "https://server.coffee.intelakah.com/api/auth/login")

xhr.setRequestHeader("Content-Type", "application/json")

xhr.send(JSON.stringify({ email: emailsend }))

xhr.onload = function () {

var data = JSON.parse(xhr.responseText)

if (data.status == 404) {

alert(data.message)

} else {

localStorage.setItem("gmail", emailsend)

window.location.href = `verify.html`

}

};

});