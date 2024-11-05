// layout.js

// Tải sidebar từ file sidebar.html
fetch("layout/Sidebar.html")
  .then((response) => response.text())
  .then((data) => {
    document.getElementById("sidebar-container").innerHTML = data;
  });

fetch("layout/Header.html")
  .then((response) => response.text())
  .then((data) => {
    document.getElementById("header-container").innerHTML = data;
  });

// Ẩn sidebar (nếu cần)
const sidebar = document.querySelector(".left-sidebar");
if (sidebar) {
  sidebar.style.display = "none"; // Ẩn sidebar
}

// Điều chỉnh nội dung chính
const bodyWrapper = document.querySelector(".body-wrapper");
if (bodyWrapper) {
  bodyWrapper.style.width = "100%"; // Đặt chiều rộng của body-wrapper là 100%
  bodyWrapper.style.marginLeft = "0"; // Đặt khoảng cách bên trái là 0
}
