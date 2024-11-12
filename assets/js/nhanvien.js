var app = angular.module("myApp", []);

app.controller("NhanVienController", function ($scope, $http) {
  $scope.nhanViens = [];
  $scope.formData = {}; // Dùng đối tượng này cho cả thêm mới và sửa
  $scope.editMode = false;

  // Load dữ liệu ban đầu
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

  $scope.addNhanVien = function (formData) {
    formData.maNhanVien = "NV" + new Date().getTime(); // Tạo mã nhân viên

    // Kiểm tra các trường bắt buộc
    if (!formData.matKhau || !formData.cccd || !formData.ngaySinh) {
      toastr.error("Vui lòng điền đầy đủ thông tin bắt buộc.");
      return;
    }

    $http.post("http://localhost:8080/nhanvien", formData).then(
      function (response) {
        $scope.nhanViens.push(response.data);
        toastr.success("Thêm nhân viên thành công!");
        resetForm();
      },
      function (error) {
        console.error("Lỗi khi thêm:", error);
        toastr.error("Có lỗi xảy ra khi thêm nhân viên.");
      }
    );
  };

  $scope.updateNhanVien = function (formData) {
    if (formData.id) {
      $http.put(`http://localhost:8080/nhanvien/${formData.id}`, formData).then(
        function (response) {
          toastr.success("Cập nhật nhân viên thành công!");
          resetForm(); // Reset form sau khi cập nhật thành công
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

  $scope.editNhanVien = function (nhanVien) {
    $scope.formData = angular.copy(nhanVien); // Sao chép dữ liệu nhân viên được chọn
    $scope.editMode = true;
    $("#detailsModal").modal("hide"); // Đóng modal chi tiết
    $("#editModal").modal("show"); // Mở modal chỉnh sửa
  };

  // Mở modal thêm nhân viên
  $scope.openAddModal = function () {
    resetForm(); // Gọi hàm resetForm để thiết lập lại form
    $scope.editMode = false; // Đặt chế độ chỉnh sửa là false để đảm bảo là chế độ thêm mới
    $("#detailsModal").modal("hide"); // Đảm bảo đóng modal chi tiết nếu có
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
      // Cập nhật nhân viên
      $scope.updateNhanVien($scope.formData);
    } else {
      // Thêm mới nhân viên
      $scope.addNhanVien($scope.formData);
    }
  };

  // Reset form
  function resetForm() {
    $scope.formData = {
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
      matKhau: "",
    };
    $scope.editMode = false;
    $("#editModal").modal("hide"); // Đóng modal sau khi hoàn tất
    $scope.loadData(); // Tải lại dữ liệu nhân viên
  }

  $scope.loadData();
});
