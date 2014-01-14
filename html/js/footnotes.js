// Shows footnotes as popups, requires jQuery.
// Originally written by Lukas Mathis:
// http://ignorethecode.net/blog/2010/04/20/footnotes/
// Adapted by Andres Raba, public domain.

$(document).ready(function () {
  var popup = "#footnote_popup";
  var Footnotes = {
    footnotetimeout: false,
    setup: function () {
      var body = $("body");
      var footnotelinks = $("a.footnote_link");
      body.attr('tabindex', '0');
      footnotelinks.attr('tabindex', '0');
      // Don't follow footnote link on click:
      footnotelinks.click(function () { return false; });

      body.unbind('click', Footnotes.bodyclick);
      footnotelinks.unbind('click', Footnotes.footnoteclick);
      footnotelinks.unbind('blur', Footnotes.footnoteout);

      body.bind('click', Footnotes.bodyclick);
      // Bind new behaviour where click will pop up the footnote:
      footnotelinks.bind('click', Footnotes.footnoteclick);
      // ...and click outside of popup will make it disappear:
      footnotelinks.bind('blur', Footnotes.footnoteout);
    },
    bodyclick: function () { void(0); },
    footnoteclick: function () {
      clearTimeout(Footnotes.footnotetimeout);
      $(popup).stop();
      $(popup).remove();

      var id = $(this).attr('href').substr(1);
      var position = $(this).offset();

      var div = $(document.createElement('div'));
      div.attr('id', popup.substr(1));
      // To be able to fire blur event when clicked outside:
      div.attr('tabindex', '0'); 

      div.bind('click', Footnotes.divclick);
      div.bind('blur', Footnotes.footnoteout);

      var el = document.getElementById(id);
      div.html($(el).html());

      var popup_width = $("section").width();
      div.css({
        position: 'absolute',
        width: popup_width,
        opacity: 1
      });

      $(document.body).append(div);

      var left = $("section").offset().left - 35;

      // Popup opens below the link unless there is 
      // not enough room below and enough above.
      var top = position.top + 20;
      if ((top + div.height() + 30 >
            $(window).height() + $(window).scrollTop())
          &&
          (top - div.height() - 42 > $(window).scrollTop())) {
        top = position.top - div.height() - 20;
      }
      div.css({ left: left,
                top: top });
    },
    footnoteout: function () {
      Footnotes.footnotetimeout = setTimeout(function () {
        $(popup).animate({
          opacity: 0
        }, 800, function () {
          $(popup).remove();
        });
      }, 0);
    },
    divclick: function () {
      clearTimeout(Footnotes.footnotetimeout);
      $(popup).stop();
      $(popup).css({
        opacity: 1
      });
    }
  };
  Footnotes.setup();
});
