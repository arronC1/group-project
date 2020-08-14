// Change password modal
$(function () {
    $('#changePasswordSubmit').click(function (e) {
        e.preventDefault();
        $.ajax({
            url: "/login/changepassword",
            dataType: 'json',
            type: "POST",
            data: $("#change-password").serialize(),
            success: function (data) {
                if (data.hasOwnProperty('errors')) {
                    alert(data['errors']);
                }
                else {
                    $('#changePasswordModal').modal('hide');
                    console.log(JSON.stringify(data));
                    alert(data['success']);
                }
            }
        });
    });
});
