let API = "http://localhost:8000/addPost";

let btnTweet = document.getElementById("tweet");
let postBlock = document.getElementById("post-block");
let inpPost = document.getElementById("inp-post");
let inpHerf = document.getElementById("inp-href");
let btnPost = document.getElementById("btn-post");
let list = document.getElementById("list");
let btnClose = document.getElementById("btn-close");

btnTweet.addEventListener("click", function () {
  postBlock.style.display = "flex";
  btnTweet.style.display = "none";
  list.style.display = "none";
});

btnClose.addEventListener("click", function () {
  postBlock.style.display = "none";
  btnTweet.style.display = "flex";
  list.style.display = "block";
});

btnPost.addEventListener("click", async function () {
  btnTweet.style.display = "flex";
  postBlock.style.display = "none";
  list.style.display = "block";
  let newPost = {
    text: inpPost.value,
    img: inpHerf.value,
  };
  await fetch(API, {
    method: "POST",
    body: JSON.stringify(newPost),
    headers: {
      "Content-type": "application/json; charset=utf-8",
    },
  });
  inpPost.value = "";
  inpHerf.value = "";
  getPost();
});

let inpSearch = document.getElementById("search");
inpSearch.addEventListener("input", function () {
  getPost();
});

let pagination = document.getElementById("pagination");
let page = 1;

async function getPost() {
  let response = await fetch(
    `${API}?q=${inpSearch.value}&_page=${page}&_limit=3`
  )
    .then(res => res.json())
    .catch(err => console.log(err));

  let allPost = await fetch(API)
    .then(res => res.json())
    .catch(err => console.log(err));

  let lastPage = Math.ceil(allPost.length / 3);

  list.innerHTML = "";

  response.forEach(item => {
    let newElem = document.createElement("div");
    newElem.style.marginTop = "20px";
    newElem.classList = "elements";
    newElem.id = item.id;
    newElem.innerHTML = `
    <span id="item-text">${item.text}</span>
    <div><img src="${item.img}"></div>
    <div id="icon">
   
    </div>
    <button class="edit-modal">Edit</button>
    <button id='like-icon'>like</button>
    <button class="delete-modal">Delete</button>
    `;
    list.append(newElem);
  });
  pagination.innerHTML = `
  <button id="btn-prev" ${page === 1 ? "disabled" : ""}>prev</button>
  <span id="page">${page}</span>
  <button ${page === lastPage ? "disabled" : ""} id="btn-next">next</button>
  `;
}
getPost();

let modalEdit = document.getElementById("modal-edit");
let inpEditText = document.getElementById("inp-edit-text");
let inpEditImg = document.getElementById("inp-edit-img");
let btnSaveEdit = document.getElementById("btn-save-edit");
let btnEditClose = document.getElementById("modal-edit-close");
let inpEditId = document.getElementById("inp-edit-id");

btnEditClose.addEventListener("click", function () {
  modalEdit.style.display = "none";
});

btnSaveEdit.addEventListener("click", async function () {
  let editPost = {
    text: inpEditText.value,
    img: inpEditImg.value,
  };

  let id = inpEditId.value;
  await fetch(`${API}/${id}`, {
    method: "PATCH",
    body: JSON.stringify(editPost),
    headers: {
      "Content-type": "application/json; charset=utf-8",
    },
  });
  modalEdit.style.display = "none";
  getPost();
});

document.addEventListener("click", async function (e) {
  if (e.target.className === "delete-modal") {
    let id = e.target.parentNode.id;
    await fetch(`${API}/${id}`, {
      method: "DELETE",
    });
    getPost();
  }
  if (e.target.className === "edit-modal") {
    modalEdit.style.display = "flex";
    let id = e.target.parentNode.id;
    let response = await fetch(`${API}/${id}`)
      .then(res => res.json())
      .catch(err => console.log(err));
    inpEditText.value = response.text;
    inpEditImg.value = response.img;
    inpEditId.value = response.id;
  }
  let span = document.createElement("span");
  let button = document.getElementById("clickme");
  // let count = document.getElementById("span");

  let count = [0];
  let cont2 = [0];
  button.addEventListener("click", function () {
    count += cont2;
  });
  console.log(count.length);
  // console.log(conut);

  // let like = 0;
  // if (e.target.id === "like-icon") {
  //   like += 1;
  //   list.append(like);
  // }
  // console.log(like);
  if (e.target.id === "btn-next") {
    page++;
    getPost();
  }
  if (e.target.id === "btn-prev") {
    page--;
    getPost();
  }
});
