module.exports = class{
    TextType = {
        From: 'From',
        To: 'To',
        Info: 'Info',
        Event: 'Event',
        Message: 'Msg'
    };

    addText(texttype, text) {
        const t = '<p class="cui-text">' + texttype + ': ' + text + '</p>';
        $('#cui-text-area').append(t);
    }
}

$('#cui-clear-text-button').on('click', function(){
    $('#cui-text-area').empty();
});