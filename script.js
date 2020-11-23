
var profile = null;
var op = 0;

function getSystemStatus() {
    if (WASMGo == null ) {
        return 0
    } else {
        return WASMGo.getState();
    }
}

function waitFinished() {
    $('#cover-spin').hide();
}

function waitForIt() {
    $('#cover-spin').show(0)
}

function display_element(id) {
    maind = document.getElementById("main-div");
    ch = maind.firstChild;
    while (ch != null) {
        if ( ch.style != null) {
            ch.style.display = "none";
        }
        ch = ch.nextSibling;
    }
    document.getElementById(id).style.display = "block";
}

function display_func(id, validate, openlogin) {

    systemStatus = getSystemStatus()

    if ( validate==true) {
        if (systemStatus == 0) {
            alert("please insert master key to continue...");
            return;
        }
    }
    maind = document.getElementById("main-div");
    ch = maind.firstChild;
    while (ch != null) {
        if ( ch.style != null) {
            ch.style.display = "none";
        }
        ch = ch.nextSibling;
    }
    document.getElementById(id).style.display = "block";
    setHeading();
    if (systemStatus == 0) {
        document.getElementById("logout").style.display="none";
        document.getElementById("login").style.display="block";

        if (openlogin) {
            const link = document.getElementById("loginLink");
            // this is necessary as link.click() does not work on the latest firefox
            link.dispatchEvent(
                new MouseEvent('click', {
                    bubbles: true,
                    cancelable: true,
                    view: window
                })
            );
        }
    } else {
        document.getElementById("logout").style.display="block";
        document.getElementById("login").style.display="none";
    }

}


function setHeading() {
    systemStatus = getSystemStatus()
    if (systemStatus == 0) {
        document.getElementById('sys_status').innerHTML = "System Not Initialized";
        document.getElementById('sys_status').style.color = "#B53009"
        document.getElementById('sidebarCollapse').style.backgroundColor = "#B53009"
    } else {
        document.getElementById('sys_status').innerHTML = "System Initialized";
        document.getElementById('sys_status').style.color = "#2C552F"
        document.getElementById('sidebarCollapse').style.backgroundColor = "#6d7fcc"
    }
}


async function onSignIn(googleUser) {
    waitForIt();
    //rk: call this to reset ap state
    WASMGo.reset();
    try {
        await  WASMGo.instantiateWithJWT(googleUser.getAuthResponse(true).id_token  )
        setHeading();
        const link = document.getElementById("sidebarCollapse");
        // this is necessary as link.click() does not work on the latest firefox
        link.dispatchEvent(
            new MouseEvent('click', {
                bubbles: true,
                cancelable: true,
                view: window
            })
        );

        display_func("encrypt_data",true);
        systemStatus = getSystemStatus()
        waitFinished();
    } catch (err) {
        waitFinished();
        alert(err)
    }
};


function signOut() {
    WASMGo.reset();
    var auth2 = gapi.auth2.getAuthInstance();
    auth2.signOut();
    display_func("master_key",false)
};

var local_client = '27307749121-8ha68mleqi4kqhlvj3rgugg8mc615e1r.apps.googleusercontent.com';
var git_client = `1069934900773-fn61ukfjudqa9medkn4sms9902ik9mtd.apps.googleusercontent.com`;

function startApp() {
    gapi.load('auth2', function(){
        // Retrieve the singleton for the GoogleAuth library and set up the client.
        auth2 = gapi.auth2.init({
            //client_id: git_client,
            client_id: git_client,
            cookiepolicy: 'single_host_origin',
            // Request scopes in addition to 'profile' and 'email'
            //scope: 'additional_scope'
        });
        attachSignin(document.getElementById('customBtn'));
        attachSignin(document.getElementById('customBtnBody'));
    });
}

function attachSignin(element) {
    auth2.attachClickHandler(element, {},
        function(googleUser) {
            onSignIn(googleUser)
        }, function(error) {
        });
}

function myDisplayer(some) {
    document.getElementById("demo").innerHTML = some;
}


function onEncryptSuccess(fileName,encryptedData,error) {
    waitFinished();
    if (error == null) {
        document.getElementById("encrypted_text").value = encryptedData;
    } else {
        alert(error)
    }
}

function onDecryptSuccess(fileName,decryptedData,error) {
    waitFinished();
    if (error == null) {
        document.getElementById("plain_text").value = decryptedData;
    } else {
        alert(error)
    }
}


async function crypto_local( data, encrypt) {

    waitForIt();

    var email = document.getElementById("encrypt_emails").value ;
    out = "";
    try {
        if (encrypt == true) {
            const response = await WASMGo.encrypt(data, "plain data", data.length, email);
            document.getElementById("encrypted_text").value = response.toString()
        } else {
            const response = await WASMGo.decrypt(data);
            document.getElementById("plain_text").value = response.toString();
        }
        waitFinished();
    } catch (err) {
        waitFinished()
        alert(err)
    }

}

function dataURItoBlob(dataURI, callback) {
    // convert base64 to raw binary data held in a string
    // doesn't handle URLEncoded DataURIs - see SO answer #6850276 for code that does this
    var byteString = atob(dataURI.split(',')[1]);

    // separate out the mime component
    var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0]

    // write the bytes of the string to an ArrayBuffer
    var ab = new ArrayBuffer(byteString.length);
    var ia = new Uint8Array(ab);
    for (var i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
    }

    // write the ArrayBuffer to a blob, and you're done
    var bb = new Blob([ab]);
    return bb;
}

function base64ToBlob(data) {
    // convert base64 to raw binary data held in a string
    // doesn't handle URLEncoded DataURIs - see SO answer #6850276 for code that does this
    var byteString = atob(data);


    // write the bytes of the string to an ArrayBuffer
    var ab = new ArrayBuffer(byteString.length);
    var ia = new Uint8Array(ab);
    for (var i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
    }

    // write the ArrayBuffer to a blob, and you're done
    var bb = new Blob([ab]);
    return bb;
}

function getDate() {
    var today = new Date();
    var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();

    var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    var dateTime = date+'-'+time;
    return dateTime.toString();
}



function fileEncryptCallback( fileName,encryptedData, error) {
   // waitFinished();
    if ( error != null ) {
        alert(error)
        return
    }
    var jsonBlob = new Blob([encryptedData]);
    const data = window.URL.createObjectURL(jsonBlob);
    const link = document.createElement('a');
    link.href = data;
    link.download = "encrypted"+"-"+getDate()+"-"+fileName;
    link.dispatchEvent(
        new MouseEvent('click', {
            bubbles: true,
            cancelable: true,
            view: window
        })
    );
    setTimeout(() => {
        // For Firefox it is necessary to delay revoking the ObjectURL
        window.URL.revokeObjectURL(data);
        link.remove();
    }, 100);
}

 async function  fileEncrypt() {
    waitForIt();
    var email = document.getElementById("file_emails").value ;
    var file = document.getElementById("enc_file_name").files[0];
    if (file) {
        var reader = new FileReader();

        reader.readAsDataURL(file)

        reader.onload = async function (evt) {
            try {
                let response = await WASMGo.encrypt(evt.target.result, file.name, evt.target.result.length , email );
                fileEncryptCallback( file.name , response.toString(), null )
            } catch (err) {
                alert(err)
            }
        }
        reader.onerror = function (evt) {
            console.log("error reading file");
        }
    }
    else {
        alert("select file to encrypt");
    }
    waitFinished();

}


function fileDecryptCallback( fileName,decryptedData, error) {
    //waitFinished();
    if ( error != null ) {
        alert(error)
        return
    }


    var jsonBlob = dataURItoBlob(decryptedData);
    const data = window.URL.createObjectURL(jsonBlob);
    const link = document.createElement('a');
    link.href = data;

    link.download = "decrypted"+"-"+getDate()+"-"+fileName;

    // this is necessary as link.click() does not work on the latest firefox
    link.dispatchEvent(
        new MouseEvent('click', {
            bubbles: true,
            cancelable: true,
            view: window
        })
    );

    setTimeout(() => {
        // For Firefox it is necessary to delay revoking the ObjectURL
        window.URL.revokeObjectURL(data);
        link.remove();
    }, 100);
}

async function  fileDecrypt() {
    waitForIt()
    var file = document.getElementById("enc_file_name").files[0];
    if (file) {
        var reader = new FileReader();

        reader.readAsText(file);

        reader.onload = async function (evt) {
            try {
                let response =  await WASMGo.decrypt(evt.target.result, file.name );
                fileDecryptCallback( file.name , response.toString(), null )
            } catch (err) {
                alert(err)
            }
        }
        reader.onerror = function (evt) {
            console.log("error reading file");
        }
    } else {
        alert("select file to encrypt");
    }
    waitFinished();
}


function initCSV( obj ) {
    var file = document.getElementById("csv_file_name").files[0];
    if (file) {
        var reader = new FileReader();
        reader.readAsText(file)
        reader.onload = function (evt) {
            str = evt.target.result.split(/\r?\n/)[0];
            str = str.split(",");
            ckbox = ""
            for (i = 0;i<str.length;i++) {
                ckbox += "<input name=\"csv_checkbox\" type=\"checkbox\" id=\""+i +"\" value=\"" + str[i]+ "\"> <label style=\"margin-right: 15px\" >"+ "column: " + i +"</label>";
            }
            document.getElementById("cols_csv").innerHTML = ckbox
        }
        reader.onerror = function (evt) {
            console.log("error reading file");
        }
    }
}

function csvCrypto( encrypt, columns, delimiter ) {
    var email = document.getElementById("csv_emails").value ;
    var file = document.getElementById("csv_file_name").files[0];
    if (file) {
        var reader = new FileReader();
        reader.readAsText(file);
        reader.onload = function (evt) {

            var checkedBoxes = document.querySelectorAll('input[name=csv_checkbox]:checked');

            index = "";
            for (i = 0;i<checkedBoxes.length;i++) {
                index += checkedBoxes[i].getAttribute("id");
                if ( i != checkedBoxes.length-1 ) {
                    index += ",";
                }
            }
            var out = "",out1 = "";
            if (encrypt) {
                out = WASMGo.tokenizecsv(evt.target.result,index,"",email);
            } else {
                out = WASMGo.detokenizecsv(evt.target.result,index,"");
            }
            var jsonBlob = null
            jsonBlob = new Blob([out],{type:file.type.toString()})
            const data = window.URL.createObjectURL(jsonBlob);
            const link = document.createElement('a');
            link.href = data;
            if (encrypt) {
                link.download = "encrypted"+"-"+getDate()+"-"+file.name;
            } else {
                link.download = "decrypted"+"-"+getDate()+"-"+file.name;
            }

            // this is necessary as link.click() does not work on the latest firefox
            link.dispatchEvent(
                new MouseEvent('click', {
                    bubbles: true,
                    cancelable: true,
                    view: window
                })
            );

            setTimeout(() => {
                // For Firefox it is necessary to delay revoking the ObjectURL
                window.URL.revokeObjectURL(data);
                link.remove();
            }, 100);
        }
        reader.onerror = function (evt) {
            console.log("error reading file");
        }
    } else {
        alert("select file to tokenize");
    }
}


function xlsEncryptCallback ( file,encryptedData, err ) {
    waitFinished();
    if (err != null) {
        alert(err);
        return;
    }

    const data = window.URL.createObjectURL(base64ToBlob(encryptedData));
    const link = document.createElement('a');

    link.href = data;
    link.download = "encrypted"+"-"+getDate()+"-"+file;

    // this is necessary as link.click() does not work on the latest firefox
    link.dispatchEvent(
        new MouseEvent('click', {
            bubbles: true,
            cancelable: true,
            view: window
        })
    );

    setTimeout(() => {
        // For Firefox it is necessary to delay revoking the ObjectURL
        window.URL.revokeObjectURL(data);
        link.remove();
    }, 100);
}

async function xlsFileEncrypt ( sheet, row, columns ) {
    waitForIt()
    var email = document.getElementById("excel_emails").value ;
    var file = document.getElementById("xls_file_name").files[0];
    if (file) {
        var reader = new FileReader();
        reader.readAsDataURL(file)
        reader.onload = async function (evt) {
            try {
                var idata = evt.target.result.split(",")[1];

                //var rc = '{"sheet_name":{"RowOffset":4,"Columns":[4,5]}}'
                let response = await WASMGo.encryptXLS(idata, file.name ,email,row);
                xlsEncryptCallback( file.name, response.toString(), null)
            } catch (err) {
                waitFinished()
                alert(err);
            }
        }
        reader.onerror = function (evt) {
            waitFinished()
            alert("error reading file");
        }
    } else {
        waitFinished()
        alert("select file to encrypt");
    }
}

function xlsDecryptSuccess( file,encryptedData, err ) {
    waitFinished();
    if (err != null) {
        alert(err);
        return;
    }

    const data = window.URL.createObjectURL(base64ToBlob(encryptedData));
    const link = document.createElement('a');

    link.href = data;
    link.download = "decrypted"+"-"+getDate()+"-"+file;

    // this is necessary as link.click() does not work on the latest firefox
    link.dispatchEvent(
        new MouseEvent('click', {
            bubbles: true,
            cancelable: true,
            view: window
        })
    );

    setTimeout(() => {
        // For Firefox it is necessary to delay revoking the ObjectURL
        window.URL.revokeObjectURL(data);
        link.remove();
    }, 100);
}


async function xlsFileDecrypt ( row, columns ) {
    waitForIt()
    var file = document.getElementById("xls_file_name").files[0];
    if (file) {
        var reader = new FileReader();
        reader.readAsDataURL(file)
        reader.onload = async function (evt) {
            try {
                var idata = evt.target.result.split(",")[1];
                let response = await WASMGo.decryptXLS(idata );
                xlsDecryptSuccess(file.name , response.toString(),null)
            } catch (err) {
                alert(err)
            }
        }
        reader.onerror = function (evt) {
            waitFinished()
            alert("error reading file");
        }
    } else {
        waitFinished()
        alert("select file to encrypt");
    }
}



function xlsFileCrypto( encrypt , row, columns ) {

    var email = document.getElementById("excel_emails").value ;
    var file = document.getElementById("xls_file_name").files[0];
    if (file) {
        var reader = new FileReader();

        reader.readAsDataURL(file)


        reader.onload = function (evt) {

            var out = "";

            var idata = evt.target.result.split(",")[1];

            if (encrypt) {
                out = WASMGo.encryptXLS(idata, row, columns,  email );
            } else {
                out = WASMGo.decryptXLS(idata, row, columns );
            }
            if (out == null) {
                alert("problem faced during xls crypto. The input data is not correct.")
                return
            }

            const data = window.URL.createObjectURL(base64ToBlob(out));

            const link = document.createElement('a');

            link.href = data;
            if (encrypt) {
                link.download = "encrypted"+"-"+getDate()+"-"+file.name;
            } else {
                link.download = "decrypted"+"-"+getDate()+"-"+file.name;
            }

            // this is necessary as link.click() does not work on the latest firefox
            link.dispatchEvent(
                new MouseEvent('click', {
                    bubbles: true,
                    cancelable: true,
                    view: window
                })
            );

            setTimeout(() => {
                // For Firefox it is necessary to delay revoking the ObjectURL
                window.URL.revokeObjectURL(data);
                link.remove();
            }, 100);
        }
        reader.onerror = function (evt) {
            console.log("error reading file");
        }
    } else {
        alert("select file to encrypt");
    }
}