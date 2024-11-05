// Tìm các phần tử có chứa class .sidebar-link và thêm sự kiện click
document.querySelectorAll(".sidebar-link").forEach((link) => {
  link.addEventListener("click", function () {
    // Tìm mũi tên bên trong link được nhấn
    const arrowIcon = this.querySelector(".arrow-icon");
    // Kiểm tra trạng thái của collapse (đã mở hoặc đóng)
    const collapseMenu = document.querySelector(
      this.getAttribute("data-bs-target")
    );

    // Sự kiện khi menu mở
    collapseMenu.addEventListener("shown.bs.collapse", () => {
      arrowIcon.style.transform = "rotate(90deg)";
    });

    // Sự kiện khi menu đóng
    collapseMenu.addEventListener("hidden.bs.collapse", () => {
      arrowIcon.style.transform = "rotate(0deg)";
    });
  });
});
