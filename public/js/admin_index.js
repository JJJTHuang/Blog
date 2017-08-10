/**
 * Created by tim on 17-8-4.
 */

var $adminlogin = $('#adminlogin');

$('#adminbtn').click(()=>{
    $.ajax({
        type: 'post',
        url: '/api/admin/login',
        data: {
            username: $adminlogin.find('[name="username"]').val(),
            password: $adminlogin.find('[name="password"]').val()
        },
        dataType: 'json',
        success: function(result) {
            $adminlogin.find('.colWarning').html(result.message);
            if (!result.code) {
                // 登陆成功
                window.location.reload();
            }
        }
    });
});

$('#logoutBtn').on('click', function () {
    $.ajax({
        url: '/api/admin/logout',
        success: function(result) {
            if (!result.code) {
                window.location.reload();
            }
        }
    });
});

