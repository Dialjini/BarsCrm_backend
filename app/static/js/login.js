// Авторизация
$('#auth').click(function() {
    const login = $('#login').val();
    const password = $('#password').val();
    $.ajax({
        url: '/auth',
        type: 'GET',
        data: {'login': login, 'password': password},
        dataType: 'html',
        success: function(data){
            console.log(data);
        }
    });
})