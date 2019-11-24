// Авторизация
$(document).keypress(function (e) {
    if (e.which == 13) {
        loginRequest();
    }
});

$('#auth').click(function() {
    loginRequest();
})

function loginRequest() {
    const login = $('#login').val();
    const password = $('#password').val();
    $.ajax({
        url: '/auth',
        type: 'GET',
        data: {'login': login, 'password': password},
        dataType: 'html',
        success: function(data) {
            try {
                $('.error_message').empty();
                $('.error_message').fadeIn(200).append(JSON.parse(data).message);
            } catch {
                $('.error_message').remove();
                location.reload();
            }
        }
    });
}