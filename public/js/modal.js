$(function () {

    //adapted from https://getbootstrap.com/docs/4.0/components/modal/#varying-modal-content
    var data = ['firstname', 'surname', 'email', 'student_number', 'hours', 'tasks', 'student', 'week', 'name', 'subdate', 'maxmark', 'groupassignment', 'description', 'file'];

    $(window).on('show.bs.modal', function (event) {
        var button = $(event.relatedTarget) // Button that triggered the modal
        var param

        param = button.data('title')
        $('#param-title').text(param)

        param = button.data('button')
        $('#param-button').text(param)

        param = button.data('action')
        $("#param-form").attr("action", param);

        data.forEach(function(d){
            param = button.data(d)
            $('#param-' + d).val(param)
        })

    });
});
