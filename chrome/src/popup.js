$(function() {
  //alert(chrome.i18n.getMessage("extension_name"));
  // sends message to background script

  localizeHtmlPage();
  var userid = 0;

  function setuserid(userid) {
      // Do stuff
      console.log(userid);
      $('#config').attr('href', $('#config').attr('href')+"#"+ userid );
      $('#config').data('userid', userid );
  }

  function getBugVal(callback) {
      var userid = "";

      chrome.storage.sync.get('userid', function (obj) {
          console.log(obj.userid);
          userid = obj.userid;
          callback(userid);
      });
  }

  getBugVal(setuserid);



  //console.log('userid2 '+  );



  chrome.tabs.query({active:true,currentWindow:true},function(tab){
    //Be aware that `tab` is an array of Tabs
    //alert(tab[0].url);
    //$('#save a').attr('href', tab[0].url);


    $('#save a').click(function() {



      var $that = $(this);
      var action = $that.data('action');
      var userid = $('#config').data('userid');

      appdb = new Firebase('https://dpoakaspinechromext.firebaseio.com');
      var encodedURL = window.btoa( tab[0].url );
      console.log('encodedURL'+encodedURL+$that.attr('href'));
      var ClickRef = appdb.child("/user/"+userid+"/saves/"+action+"/"+encodedURL+"/");
      ClickRef.set({ created: Firebase.ServerValue.TIMESTAMP, encodedURL: encodedURL, url: tab[0].url, title: tab[0].title });

      var URLRef = appdb.child("/urls/"+encodedURL);
      URLRef.push({ created: Firebase.ServerValue.TIMESTAMP, url: tab[0].url, title: tab[0].title });

      $that.find('i').remove();
      $that.append('<i class="fa fa-check" aria-hidden="true"></i>');
      $that.find('i').hide();
      $that.find('i').fadeIn();

        return false;
    });
  });

});

function localizeHtmlPage()
{
    //Localize by replacing __MSG_***__ meta tags
    var objects = document.getElementsByTagName('a');
    for (var j = 0; j < objects.length; j++)
    {
        var obj = objects[j];

        var valStrH = obj.innerHTML.toString();
        var valNewH = valStrH.replace(/__MSG_(\w+)__/g, function(match, v1)
        {
            return v1 ? chrome.i18n.getMessage(v1) : "";
        });

        if(valNewH != valStrH)
        {
            obj.innerHTML = valNewH;
        }
    }
}
