var app = angular.module("myApp", []);

app.controller("NhanVienController", function ($scope, $http) {
  $scope.nhanViens = [];
  $scope.newNhanVien = {};
  $scope.selectedNhanVien = {};
  $scope.editMode = false;

  // Load dữ liệu ban đầu
  $scope.loadData = function () {
    $http.get("http://localhost:8080/nhanvien/all").then(
      function (response) {
        $scope.nhanViens = response.data.map((nv) => {
          nv.ngaySinh = new Date(nv.ngaySinh);
          nv.ngayTuyenDung = new Date(nv.ngayTuyenDung);
          nv.ngayNghiViec = nv.ngayNghiViec ? new Date(nv.ngayNghiViec) : null;
          return nv;
        });
      },
      function (error) {
        console.error("Lỗi khi tải dữ liệu:", error);
        toastr.error("Không thể tải dữ liệu.");
      }
    );
  };

  $scope.addNhanVien = function () {
    console.log($scope.newNhanVien); // Kiểm tra dữ liệu
    $http.post("http://localhost:8080/nhanvien", $scope.newNhanVien).then(
      function (response) {
        $scope.nhanViens.push(response.data);
        resetForm();
        toastr.success("Thêm nhân viên thành công!");
      },
      function (error) {
        console.error("Lỗi khi thêm:", error);
        toastr.error("Có lỗi xảy ra khi thêm nhân viên.");
      }
    );
  };

  $scope.updateNhanVien = function (selectedNhanVien) {
    console.log(selectedNhanVien); // Kiểm tra dữ liệu
    if (selectedNhanVien.id) {
      $http
        .put(
          `http://localhost:8080/nhanvien/${selectedNhanVien.id}`,
          selectedNhanVien
        )
        .then(
          function (response) {
            toastr.success("Cập nhật nhân viên thành công!");
            $scope.loadData(); // Làm mới dữ liệu sau khi cập nhật
          },
          function (error) {
            console.error("Lỗi khi cập nhật:", error);
            toastr.error("Có lỗi xảy ra khi cập nhật.");
          }
        );
    } else {
      toastr.error("ID nhân viên không hợp lệ.");
    }
  };

  $scope.updateNhanVien = function (selectedNhanVien) {
    console.log(selectedNhanVien); // Kiểm tra dữ liệu
    if (selectedNhanVien.id) {
      $http
        .put(
          `http://localhost:8080/nhanvien/${selectedNhanVien.id}`,
          selectedNhanVien
        )
        .then(
          function (response) {
            toastr.success("Cập nhật nhân viên thành công!");
            $scope.loadData(); // Làm mới dữ liệu sau khi cập nhật
          },
          function (error) {
            console.error("Lỗi khi cập nhật:", error);
            toastr.error("Có lỗi xảy ra khi cập nhật.");
          }
        );
    } else {
      toastr.error("ID nhân viên không hợp lệ.");
    }
  };

  // Xóa nhân viên
  $scope.deleteNhanVien = function (id) {
    if (confirm("Bạn có chắc chắn muốn xóa nhân viên này?")) {
      $http.delete(`http://localhost:8080/nhanvien/${id}`).then(
        function (response) {
          $scope.loadData();
          toastr.success("Xóa nhân viên thành công!");
        },
        function (error) {
          console.error("Lỗi khi xóa:", error);
          toastr.error("Có lỗi xảy ra khi xóa.");
        }
      );
    }
  };

  // Chỉnh sửa nhân viên
  $scope.editNhanVien = function (nhanVien) {
    $("#detailsModal").modal("hide");
    $scope.selectedNhanVien = angular.copy(nhanVien);
    $scope.editMode = true;
    $("#editModal").modal("show");
  };

  // Mở modal thêm nhân viên
  $scope.openAddModal = function () {
    // Đặt lại đối tượng nhân viên mới với các giá trị rỗng
    $scope.newNhanVien = {
      id: null,
      maNhanVien: null,
      tenNhanVien: "",
      email: "",
      soDienThoai: "",
      diaChi: "",
      ngaySinh: null,
      ngayTuyenDung: null,
      ngayNghiViec: null,
      vaiTro: null,
      trangThai: null,
      cccd: "",
      tenTaiKhoan: "",
    };

    // Đặt chế độ chỉnh sửa là false để đảm bảo là chế độ thêm mới
    $scope.editMode = false;

    // Đóng tất cả các modal khác trước khi mở modal mới
    $("#detailsModal").modal("hide"); // Đảm bảo đóng modal chi tiết nếu có

    // Mở modal thêm nhân viên
    $("#editModal").modal("show"); // Mở modal thêm nhân viên
  };

  // Hiển thị chi tiết nhân viên
  $scope.viewDetails = function (nhanVien) {
    $scope.selectedNhanVien = angular.copy(nhanVien);
    $("#detailsModal").modal("show"); // Đảm bảo rằng ID modal là #detailsModal
  };

  // Hàm chuyển đổi vai trò
  $scope.getVaiTroName = function (vaiTro) {
    switch (vaiTro) {
      case 0:
        return "Quản trị viên";
      case 1:
        return "Nhân viên";
      case 2:
        return "Khách";
      default:
        return "Không xác định";
    }
  };

  // Hàm chuyển đổi trạng thái
  $scope.getTrangThaiName = function (trangThai) {
    switch (trangThai) {
      case 1:
        return "Hoạt động";
      case 0:
        return "Đã nghỉ việc";
      default:
        return "Không xác định";
    }
  };

  $scope.submitData = function () {
    if ($scope.editMode) {
      $scope.updateNhanVien($scope.selectedNhanVien.id);
    } else {
      $scope.addNhanVien();
    }
  };

  // Reset form sau khi thao tác
  function resetForm() {
    $scope.newNhanVien = {};
    $scope.selectedNhanVien = {};
    $scope.editMode = false;
    $("#editModal").modal("hide");
    $scope.loadData();
  }

  $scope.loadData();
});
