var app = angular.module("myApp", []);

app.controller("AnhController", function ($scope, $http) {
  // Khởi tạo danh sách ảnh đã tải lên
  $scope.uploadedImages = [];
  $scope.message = "";

  // Lấy danh sách ảnh khi khởi tạo controller
  $scope.getImages = function () {
    $http.get("http://localhost:8080/anhgiay").then(
      function (response) {
        $scope.uploadedImages = response.data;
      },
      function (error) {
        console.error("Error fetching images: ", error);
        toastr.error("Có lỗi khi tải danh sách ảnh!", "Lỗi");
      }
    );
  };

  // Gọi hàm lấy ảnh khi load trang
  $scope.getImages();

  // Upload file
  $scope.uploadFile = function () {
    var fileInput = document.getElementById("file");
    var formData = new FormData();
    formData.append("file", fileInput.files[0]);
    formData.append("trangThai", 1); // Trạng thái mặc định là 1

    // Gửi yêu cầu POST để tải ảnh lên
    $http
      .post("http://localhost:8080/anhgiay/upload", formData, {
        headers: { "Content-Type": undefined }, // Để trình duyệt tự động thiết lập boundary
      })
      .then(
        function (response) {
          // Hiển thị thông báo thành công
          toastr.success("Tải ảnh thành công!", "Thông báo");
          // Thêm ảnh mới vào danh sách
          $scope.uploadedImages.push(response.data);
          // Cập nhật lại danh sách ảnh
          $scope.getImages(); // Bạn có thể bỏ qua gọi lại nếu không muốn tải lại toàn bộ danh sách
        },
        function (error) {
          console.error("Error uploading file: ", error);
          toastr.error(
            "Có lỗi xảy ra khi tải ảnh lên. Vui lòng thử lại.",
            "Lỗi"
          );
        }
      );
  };

  // Lấy URL ảnh
  $scope.getImageUrl = function (image) {
    return (
      "http://localhost:8080/anhgiay/images/" +
      image.tenURL.replace(/^\/images\//, "")
    );
  };

  // Cập nhật danh sách ảnh đã chọn
  $scope.updateSelectedImages = function () {
    $scope.selectedImages = $scope.uploadedImages.filter(function (image) {
      return image.selected;
    });
  };

  $scope.deleteSelectedImages = function () {
    if ($scope.selectedImages.length > 0) {
      // Lấy danh sách các ID ảnh đã chọn
      var selectedIds = $scope.selectedImages.map(function (image) {
        return image.id;
      });

      $http
        .delete("http://localhost:8080/anhgiay", {
          data: selectedIds, // Gửi danh sách ảnh dưới dạng body
          headers: { "Content-Type": "application/json" }, // Đảm bảo header Content-Type đúng
        })
        .then(function (response) {
          // Xóa ảnh đã chọn khỏi mảng uploadedImages
          $scope.uploadedImages = $scope.uploadedImages.filter(function (
            image
          ) {
            return !image.selected;
          });
          $scope.selectedImages = []; // Reset selectedImages
          toastr.success("Đã xóa ảnh thành công!", "Thông báo");
        })
        .catch(function (error) {
          console.error("Error deleting images: ", error);
          toastr.error("Có lỗi xảy ra khi xóa ảnh. Vui lòng thử lại.", "Lỗi");
        });
    } else {
      toastr.warning("Vui lòng chọn ít nhất một ảnh để xóa!", "Thông báo");
    }
  };
});
