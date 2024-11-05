var app = angular.module("myApp", []);

app.controller("NhanVienController", function ($scope, $http) {
  $scope.nhanViens = [];
  $scope.newNhanVien = {};
  $scope.selectedNhanVien = {};
  $scope.editMode = false;

  // Load dữ liệu ban đầu
  // Giả sử response.data có trường "ngaySinh" là một chuỗi ngày tháng
  $scope.loadData = function () {
    $http.get("http://localhost:8080/nhanvien/all").then(
      function (response) {
        // Chuyển đổi trường ngày tháng thành đối tượng Date
        $scope.nhanViens = response.data.map((nv) => {
          nv.ngaySinh = new Date(nv.ngaySinh);
          nv.ngayTuyenDung = new Date(nv.ngayTuyenDung);
          nv.ngayNghiViec = nv.ngayNghiViec ? new Date(nv.ngayNghiViec) : null; // Cập nhật trường ngày nghỉ việc
          return nv;
        });
      },
      function (error) {
        console.error("Lỗi khi lấy dữ liệu:", error);
      }
    );
  };

  $scope.getStatus = function (ngayNghiViec) {
    return ngayNghiViec ? "Đã nghỉ việc" : "Đang làm";
  };

  // Thêm mới nhân viên
  $scope.addNhanVien = function () {
    $http.post("http://localhost:8080/nhanvien", $scope.newNhanVien).then(
      function (response) {
        $scope.nhanViens.push(response.data);
        resetForm();
        alert("Thêm nhân viên thành công!"); // Thông báo thành công
      },
      function (error) {
        console.error("Có lỗi xảy ra:", error);
      }
    );
  };

  // Cập nhật nhân viên
  $scope.updateNhanVien = function () {
    $http
      .put(
        `http://localhost:8080/nhanvien/${$scope.selectedNhanVien.maNhanVien}`,
        $scope.selectedNhanVien
      )
      .then(
        function (response) {
          const index = $scope.nhanViens.findIndex(
            (nv) => nv.maNhanVien === $scope.selectedNhanVien.maNhanVien
          );
          $scope.nhanViens[index] = response.data;
          resetForm();
          alert("Cập nhật nhân viên thành công!"); // Thông báo thành công
        },
        function (error) {
          console.error("Có lỗi xảy ra:", error);
        }
      );
  };

  // Submit dữ liệu
  $scope.submitData = function () {
    if ($scope.editMode) {
      $scope.updateNhanVien(); // Cập nhật nhân viên
    } else {
      $scope.addNhanVien(); // Thêm mới nhân viên
    }
  };

  // Chỉnh sửa nhân viên
  $scope.editNhanVien = function (nhanVien) {
    $scope.selectedNhanVien = angular.copy(nhanVien);
    $scope.editMode = true;
    $("#editModal").modal("show");
  };

  // Xóa nhân viên
  $scope.deleteNhanVien = function (id) {
    if (confirm("Bạn có chắc chắn muốn xóa nhân viên này?")) {
      // Xác nhận trước khi xóa
      $http.delete(`http://localhost:8080/nhanvien/${id}`).then(
        function (response) {
          $scope.loadData(); // Load lại dữ liệu
          alert("Xóa nhân viên thành công!"); // Thông báo thành công
        },
        function (error) {
          console.error("Lỗi khi xóa:", error);
        }
      );
    }
  };

  // Xem chi tiết nhân viên
  $scope.viewDetails = function (nhanVien) {
    $scope.selectedNhanVien = angular.copy(nhanVien);
    $("#detailsModal").modal("show");
  };

  // Hiển thị tên vai trò
  $scope.getVaiTroName = function (vaiTro) {
    return vaiTro == 0 ? "ADMIN" : "Nhân Viên";
  };

  // Hiển thị tên trạng thái
  $scope.getTrangThaiName = function (trangThai) {
    return trangThai == 1 ? "Hoạt Động" : "Ngưng Hoạt Động";
  };

  // Reset form
  function resetForm() {
    $scope.newNhanVien = {};
    $scope.selectedNhanVien = {};
    $scope.editMode = false;
    $("#addModal").modal("hide");
    $("#editModal").modal("hide");
    $("#detailsModal").modal("hide");
    $scope.loadData(); // Tải lại dữ liệu
  }

  // Khởi động dữ liệu
  $scope.loadData();
});
