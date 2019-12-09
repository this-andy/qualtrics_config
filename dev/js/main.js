(function($) {

    /**
     * Remove empty paragraphs
     */

    $('.QuestionText p:empty').remove();
    $('.QuestionText p').each(function () {
        if($(this).html().replace(/\s|&nbsp;/g, '').length === 0) {
            $(this).remove();
        }
    });

    /**
     * Remove empty QuestionBody
     */
    $('.QuestionBody:empty').remove();

    /**
     * Update next and previous button text
     */
    $('input[name="NextButton"]').val('Next page');
    $('input[name="NexButton"]').val('Next page');



})(jQuery);