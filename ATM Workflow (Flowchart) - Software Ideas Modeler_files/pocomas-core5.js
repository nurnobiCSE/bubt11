function initMainMenu() {
    $('.expandable-menu-item')
    .mouseenter(function () {
        var thisMenuItem = $(this);        
        $('.main-menu .expandable-menu-item').not(thisMenuItem).addClass("collapsed-menu");
        thisMenuItem.removeClass("collapsed-menu");
    });

    $('.expandable-menu-item')
    .mouseleave(function () {
        var thisMenuItem = $(this);        
        thisMenuItem.addClass("collapsed-menu");
    });
}

function createCookie(name, value, days) {
    var expires;

    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = "; expires=" + date.toGMTString();
    } else {
        expires = "";
    }
    document.cookie = encodeURIComponent(name) + "=" + encodeURIComponent(value) + expires + "; path=/";
}

function getCookie(name) {    
    var nameEncoded = encodeURIComponent(name) + "=";
    var cookies = document.cookie.split(';');
    for (var i = 0; i < cookies.length; i++) {
        var cookie = cookies[i];
        while (cookie.charAt(0) === ' ')
            cookie = cookie.substring(1, cookie.length);
        if (cookie.indexOf(nameEncoded) === 0)
            return decodeURIComponent(cookie.substring(nameEncoded.length, cookie.length));
    }
    return null;
}

function deleteCookie(name) {
    createCookie(name, "", -1);
}

function initClickable() {
    $('.clickable-div').click(function (e) { $(this).toggleClass('clicked'); })
}

function copyTextToClipboardUsingTextArea(text) {
    var textArea = document.createElement("textarea");
    textArea.value = text;

    // To not scroll to bottom of page
    textArea.style.top = "0";
    textArea.style.left = "0";
    textArea.style.position = "fixed";

    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    try {
        var successful = document.execCommand('copy');
        var msg = successful ? 'successful' : 'unsuccessful';
    }
    finally { }

    document.body.removeChild(textArea);
}

function copyTextToClipboard(text) {
    if (!navigator.clipboard) {
        copyTextToClipboardUsingTextArea(text);
        return;
    }
    navigator.clipboard.writeText(text);
}

function showOriginal(evt, id) {
    var savedContent = "";
    var savedSubject = "";
    var originalContent = document.getElementById("ocText" + id);
    var originalSubject = document.getElementById("ocSubject" + id);
    var target = document.getElementById("c_content" + id);
    if (target != null) {
        savedContent = target.innerHTML;
        target.innerHTML = originalContent.value;
    }
    var targetSubject = document.getElementById("c_subject" + id);
    if (targetSubject != null) {
        savedSubject = targetSubject.innerHTML;
        targetSubject.innerHTML = originalSubject.value;
    }

    originalContent.value = savedContent;
    originalSubject.value = savedSubject;
    if (evt.target.class == "translation") {
        evt.target.innerHTML = "Show Original";
        evt.target.class = "original";
    }
    else {
        evt.target.innerHTML = "Show Translation";
        evt.target.class = "translation";
    }
}

var scrollsAtTop = 0; var scrollsAtMiddle = 0; var scrollsAtBottom = 0;
var articleBottom = 0; var offerWasShown = false;
function registerOffer(offerId, timeoutInSecs) {
    articleBottom = $(".article-bottom").position().top - window.innerHeight;
    let offerDiv = document.getElementById(offerId);
    let closeButton = $(offerDiv).children(".close-button");
    closeButton.on("click", e => closeOffer(offerId));
    document.addEventListener('scroll', function (e) {
        var scrollY = window.scrollY;
        var maxY = document.body.scrollHeight;
        var relativeY = scrollY / maxY;
        if (relativeY < 0.3) {
            scrollsAtTop++;
            if (scrollsAtMiddle > 2 && scrollsAtBottom > 2) {
                showOfferDelayed(offerDiv);
            }
        }
        else if (relativeY < 0.6) scrollsAtMiddle++;
        else {
            scrollsAtBottom++
            if (scrollY > articleBottom && scrollsAtTop > 2 && scrollsAtMiddle > 2) {
                showOfferDelayed(offerDiv);
            }
        }
    });

    setTimeout(
        function () {
            if (!offerWasShown) {
                offerWasShown = true;
                $(offerDiv).fadeIn(1000);
                reportOfferDisplay();
            }
        }, timeoutInSecs * 1000);
}
function showOfferDelayed(offerDiv) {
    if (!offerWasShown) {
        setTimeout(
            function () {
                if (!offerWasShown) {
                    offerWasShown = true;
                    $(offerDiv).fadeIn(1000);                    
                }
            }, 2000
        );
    }
}
function closeOffer(offerId) {
    let offerDiv = document.getElementById(offerId);
    $(offerDiv).fadeOut(1000);
}

window.addEventListener('load', (event) => {
    initMainMenu();
});
