// Get the element by id
const operations = document.getElementById("part1");
const programmableArea = document.getElementById("drop");

// add a dragstart event listener to the operation divs
operations.addEventListener("dragstart", (event) => {
  // set the data for the drag operation
  event.dataTransfer.setData("text/plain", event.target.dataset.operation);
});

// add dragover and drop event listeners to the programmableArea div
programmableArea.addEventListener("dragover", (event) => {
  event.preventDefault();
});

programmableArea.addEventListener("drop", (event) => {
  event.preventDefault();
  // get the data for the drag operation
  //get the id of the target and add the moved element to the target's DOM
  //get the id of the target element
    const operationType = event.dataTransfer.getData("text/plain");
    console.log(operationType)
  // create a new div with the operation type as the class
//   const operationDiv = document.createElement("div");
//   operationDiv.classList.add(operationType);
//   operationDiv.innerHTML = operationType;
  // append the new div to the programmableArea div
//   programmableArea.appendChild(operationDiv);

    // programmableArea = document.getElementById("programmableArea");
    console.log(operationType)
    console.log(event.target)
    if(event.target.classList.contains("insideDiv")){
        manahil(operationType, event.target)
    }
    else manahil(operationType, programmableArea)
});


function genCode() {
    document.getElementById("code").innerHTML = "";
    _genCode(document.getElementById("drop"), "");
}

function _genCode(el, indent = "") {
    for(let i = 0; i < el.children.length; i++) {
        if (el.children[i].classList.contains("canDropInside")) {
            document.getElementById("code").innerHTML += "<br>" + indent + codeToPHP(el.children[i]);
            let ell = el.children[i].getElementsByClassName("insideDiv")[0];
            _genCode(ell, indent + "   ");
            document.getElementById("code").innerHTML += "<br>" + indent + "}";
        } else {
            document.getElementById("code").innerHTML += "<br>" + indent + codeToPHP(el.children[i]);
        }
    }
}

function codeToPHP(el) {
    if(el.classList.contains("varblock")) {
        let name = el.getElementsByClassName("varname")[0].value;
        let val = el.getElementsByClassName("varVal")[0].value;
        return `$${name} = ${val};`;
    }
    else if(el.classList.contains("forblock")) {
        let val1 = el.getElementsByClassName("startfor")[0].value;
        let val2 = el.getElementsByClassName("iterfor")[0].value;
        let val3 = el.getElementsByClassName("condfor")[0].value;
        return `for ($i = ${val1}; $i < ${val2}; $i++) {${val3}`
    }
    else if(el.classList.contains("functionblock")){
        let name = el.getElementsByClassName("name")[0].value;
        let params = el.getElementsByClassName("param")[0].value.split(",");
        console.log(params)
        let paramStr = "";
        for (let i=0; i<params.length; i++) {
            if (i != params.length - 1) {
                paramStr += `$${params[i]}, `;
            }
            else {
                paramStr += `$${params[i]}`;
            }
        }

        return `function ${name}(${paramStr}) {`;


    }

    else if (el.classList.contains("arithblock")) {
        let var1 = el.getElementsByClassName("val1")[0].value;
        let var2 = el.getElementsByClassName("val2")[0].value;
        let assignTo = el.getElementsByClassName("assignto")[0].value;
        let operation = el.getElementsByClassName("operationType")[0].value;

        return `$${assignTo} = $${var1} ${operation} $${var2};`;
    }

    else if(el.classList.contains("ifblock")) {
        let var1 = el.getElementsByClassName("val1")[0].value;
        let var2 = el.getElementsByClassName("val2")[0].value;
        let operation = el.getElementsByClassName("operationType")[0].value;

        return `if ($${var1} ${operation} $${var2}) {`;

    }

    else if (el.classList.contains("outputblock")) {
        let output = el.getElementsByClassName("echo")[0].value;
        return `echo $${output};`;
    }

}

function manahil(data, parent) {
    switch (data) {
        case ("varblock"):{
            parent.innerHTML += `
        <div class="varblock manahil">
            Set
            <input type='text' class='varname'>
            To
            <input type='text' class='varVal'>
            
        </div>
        `;
            break;
        }
        case ("forblock"):{
            parent.innerHTML += `
        <div class="forblock manahil canDropInside">
            for
            <input type='text' class='startfor'>
            =
            <input type='text' class='iterfor'>
            do 
            <input type='text' class='condfor'>
            <div class="insideDiv"></div>
            </div>

        </div>
        `;
            break;
        }
        case ("Arithblock"):{
            parent.innerHTML +=
                `<div class="arithblock manahil lego">
                <input type="text" class="assignto"></input>
                <p>=</p>
                <input type="text" class="val1"></input>
        <select name="arithmatic" id="arith" class="operationType">
            <option value="+">+</option>
            <option value="-">-</option>
            <option value="*">*</option>
            <option value="/">/</option>
        </select>
        <input type="text" class="val2"></input>
        </div>`;
            break;
        }

        
        case("functionblock"):{
            parent.innerHTML +=
                `
                <div class="functionblock manahil canDropInside">
                function name <input type="text" class="name"></input>
                <label for="param">Parameters</label>
                <input type="text" id="param" name="param" class="param"></input>
                
                <div class="insideDiv"></div>
                </div>
                </div>
                `;
            break;

        }
        case ("ifblock"):{
            parent.innerHTML +=
                `<div class="ifblock manahil canDropInside">
                if
                <input type="text" class="val1"></input>
                <select name="arithmatic" id="arith" class="operationType">
                    <option value="==">==</option>
                    <option value=">=">>=</option>
                    <option value="<="><=</option>
                    <option value="!=">!=</option>
            </select>
                <input type="text" class="val2"></input>
                        <div class="insideDiv"></div>
                        </div>
                </div>`;
            break;
        }
        case ("outputblock"):{
            parent.innerHTML +=
                `<div class="outputblock manahil">
                Print
                <input type="text" class="echo"></input>
                </div>`;
                break;
            }
        default:{
            console.log('DEFAULT');
            break;
        }
        
    }
}

function execAndGetPHPOutput() {
    let code = document.getElementById("code").innerText;
    let xhr = new XMLHttpRequest();
    xhr.open("POST", "php.php", true);
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xhr.send("code=" + encodeURIComponent(code));
    xhr.onload = () => {
        console.log(xhr.responseText)
        document.getElementById("output").innerHTML = xhr.responseText;
    }
}

// function genCode() {
//     document.getElementById("code").innerHTML = "";
//     _genCode(document.getElementById("programmableArea"), "");
// }
// function phpCodes(el) {
//     if (el.classList.contains("blockElement")) {
//       switch (el.classList[0]) {
//         case "varblock": {
//           const name = el.getElementsByTagName("input")[0].value;
//           const val = el.getElementsByTagName("input")[1].value;
//           return `$${name} = ${val};`;
//         }
//         case "forblock": {
//           const start = el.getElementsByTagName("input")[0].value;
//           const end = el.getElementsByTagName("input")[1].value;
//           const statement = el.getElementsByTagName("input")[2].value;
//           return `for ($i = ${start}; $i <= ${end}; $i++) { ${statement} }`;
//         }
//         case "Arithblock": {
//           const var1 = el.getElementsByTagName("input")[0].value;
//           const operator = el.getElementsByTagName("select")[0].value;
//           const var2 = el.getElementsByTagName("input")[1].value;
//           return `$result = ${var1} ${operator} ${var2};}`;}
           
//       //     case "functionblock": { 
//       //         const functionName = el.getElementsByTagName("input")[0].value; const functionBody = el.getElementsByClassName("insideDiv")[0];
//       //          let code = function ${functionName}() {; for (let i = 0; i < functionBody.children.length; i++) { code += phpCodes(functionBody.children[i]); } code += "}"; 
//       //          return code;
//       //     case "ifblock": { 
//       //         const condition = el.getElementsByTagName("div")[0].textContent.trim();
//       //         const statement = el.getElementsByTagName("div")[1].textContent.trim(); return `if (${condition}) { ${statement} }; `}
//       //     case "outputblock": { 
//       //         const message = el.getElementsByTagName("input")[0].value; return console.log('${message}');
//       // }
//       default: {
//       return "";
//       }
//       }
//       }
//       }
      
//       function _genCode(el, indent = "") {
//       for (let i = 0; i < el.children.length; i++) {
//       if (el.children[i].classList.contains("canDropInside")) {
//       document.getElementById("code").innerHTML +=
//       "<br>" + indent + phpCodes(el.children[i]);
//       const ell = el.children[i].getElementsByClassName("insideDiv")[0];
//       _genCode(ell, indent + " ");
//       document.getElementById("code").innerHTML += "<br>" + indent + "}";
//       } else {
//       document.getElementById("code").innerHTML +=
//       "<br>" + indent + phpCodes(el.children[i]);
//       }
//       }
//       }



//     }
//     let copy= document.getElementById("drop");
//     copy.appendChild(el);
//     if (el instanceof Node) {
//         document.getElementById("drop").appendChild(el);
//     } else {
//         console.error("Failed to create element");
//     }
    
// }



// if(data=="varblock"){
    //     // el = document.createElement("div");
    //     document.getElementById("drop").innerHTML += `
    //     <div class="varblock">
    //         Set
    //         <input type='text'>
    //         To
    //         <input type='text'>
    //     </div>
    //     `;
    // }
    // else{
    //     // el = document.createElement("div");
    //     document.getElementById("drop").innerHTML += `
    //     <div class="forblock">
    //         for
    //         <input type='text'>
    //         =
    //         <input type='text'>
    //         do 
    //         <input type='text'>

    //     </div>
    //     `;
    // }