function fetchAccounts() {
  var p = document.getElementById("accounts");
  if (!p) {
    var p = document.getElementById("accountss");
  }
  var verified = document.getElementById("confirmAccountName");
  let address = document.getElementById("address");
  //delete all child element if any
  let child;
  while ((child = p.lastElementChild)) {
    p.removeChild(child);
  }
  while ((child = verified.lastElementChild)) {
    verified.removeChild(child);
  }

  let accountNumber = document.getElementById("accountNumber").value;
  const url =
    "http://intranet-ntops/CustomerService/api/customer/details/" +
    accountNumber;
  //        console.log(accountNumber);
  //document.getElementById("demo").innerHTML = this.responseText;

  //get user account info
  fetch(url)
    .then(res => res.json())
    .then(data => {
      let userDetails = data;
      //console.log(userDetails);

      let phoneNumber = userDetails.PreferredPhone;
      if (!phoneNumber) {
        //clear previous address
        address.value = null;
        var warn = document.createElement("h4");
        warn.setAttribute("id", "h4");
        warn.innerHTML = "INVALID ACCOUNT NUMBER";
        warn.setAttribute("style", "color: red;");

        p.appendChild(warn);
      } else {
        //set account name and address
        var name = document.createElement("p");
        address.value = userDetails.AddressLine1;
        //            name.setAttribute("class", "col-md-3");
        name.innerHTML = "Account Name: " + userDetails.Name;

        verified.appendChild(name);
      }
      phoneNumber = phoneNumber.substr(7);
      console.log(phoneNumber);

      //get accounts tied to account number
      let accountsUrl =
        "http://172.20.236.2:7181/api/retrievecustomerdetailsbyphone";
      let myUrl = "localhost/ref_debt/processing/getAcc";
      const reqData = { msisdn: phoneNumber, country: "NG" };
      fetch(myUrl, {
        //            credentials: 'same-origin', // 'include', default: 'omit'
        method: "POST",
        body: JSON.stringify(reqData),
        headers: new Headers({
          "Content-Type": "application/json"
        })
      }).then(res => res.json());
    })
    .catch(error => console.error(error));
}
