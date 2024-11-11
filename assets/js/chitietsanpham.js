var app = angular.module("myApp", []);

const urlParams = new URLSearchParams(window.location.search);
const id = urlParams.get("id");

app.controller("chiTietSanPhamController", function ($scope, $http, $location) {
  $http
    .get(`http://localhost:8080/chitietsanpham/${id}`)
    .then(function (response) {
      $scope.chiTietSanPhamByIDs = response.data;
      console.log(response.data);
    });

  $http
    .get(`http://localhost:8080/chitietsanpham`)
    .then(function (response) {
      $scope.chiTietSanPhams = response.data;
      console.log(response.data);
    })
    .catch(function (error) {
      console.error("Lỗi khi lấy chi tiết sản phẩm:", error);
      $scope.chiTietSanPhams = [];
    });

  $scope.chiTietSanPham = {};

  $scope.loadData = function () {
    // Lấy lại danh sách chi tiết sản phẩm sau khi xóa
    $http
      .get("http://localhost:8080/chitietsanpham")
      .then(function (response) {
        $scope.chiTietSanPhams = response.data;
        console.log("Dữ liệu chi tiết sản phẩm được làm mới:", response.data);
      })
      .catch(function (error) {
        console.error("Lỗi khi lấy lại dữ liệu chi tiết sản phẩm:", error);
        $scope.chiTietSanPhams = [];
      });
  };

  // Lấy danh sách Thương Hiệu
  $http
    .get("http://localhost:8080/thuonghieu")
    .then(function (response) {
      $scope.thuongHieus = response.data;
    })
    .catch(function (error) {
      console.error("Lỗi khi lấy danh sách thương hiệu:", error);
    });

  // Lấy danh sách Danh Mục
  $http
    .get("http://localhost:8080/danhmuc")
    .then(function (response) {
      $scope.danhMucs = response.data;
    })
    .catch(function (error) {
      console.error("Lỗi khi lấy danh sách danh mục:", error);
    });

  // Biến điều khiển chế độ chỉnh sửa
  $scope.isEditing = false;

  $scope.toggleEdit = function (chiTietSanPham) {
    chiTietSanPham.isEditing = !chiTietSanPham.isEditing;
    toastr.success("Cập nhật thành công!", "Thông báo");
  };

  // Lấy danh sách sản phẩm
  $http.get("http://localhost:8080/sanpham").then(function (response) {
    $scope.sanPhams = response.data;
    console.log($scope.sanPhams);
  });

  // Lấy danh sách kích cỡ
  $http.get("http://localhost:8080/kichco").then(function (response) {
    $scope.kichCos = response.data;
  });

  // Lấy danh sách màu sắc
  $http.get("http://localhost:8080/mausac").then(function (response) {
    $scope.mauSacs = response.data;
  });

  // Lấy danh sách đế giày
  $http.get("http://localhost:8080/degiay").then(function (response) {
    $scope.deGiays = response.data;
  });

  // Lấy danh sách chất liệu
  $http.get("http://localhost:8080/chatlieu").then(function (response) {
    $scope.chatLieus = response.data;
  });

  //tạo sản phẩm
  $scope.taoSanPham = function () {
    $scope.sanPhamPreview = [];

    $scope.kichCos.forEach((kichCo) => {
      if (kichCo.selected) {
        $scope.mauSacs.forEach((mauSac) => {
          if (mauSac.selected) {
            $scope.sanPhamPreview.push({
              sanPham: $scope.chiTietSanPham.sanPham,
              kichCo: kichCo,
              mauSac: mauSac,
              soLuong: $scope.chiTietSanPham.soLuong,
              giaBan: $scope.chiTietSanPham.giaBan,
              deGiay: $scope.chiTietSanPham.deGiay,
              chatLieu: $scope.chiTietSanPham.chatLieu,
              danhMuc: $scope.chiTietSanPham.sanPham.danhMuc,
              thuongHieu: $scope.chiTietSanPham.sanPham.thuongHieu,
              chonThem: false,
            });
          }
        });
      }
    });
  };

  $scope.themSanPham = function () {
    // Lọc các sản phẩm đã được chọn (sp.chonThem === true)
    const selectedProducts = $scope.sanPhamPreview.filter(function (sp) {
      return sp.chonThem === true; // Lọc các sản phẩm có checkbox được chọn
    });
    // Kiểm tra nếu có sản phẩm được chọn
    if (selectedProducts.length > 0) {
      // Gửi dữ liệu lên server
      $http
        .post("http://localhost:8080/chitietsanpham", selectedProducts)
        .then(function (response) {
          console.log("Thêm sản phẩm thành công:", response.data);
          toastr.success("Sản phẩm đã được thêm vào cơ sở dữ liệu.");
        })
        .catch(function (error) {
          console.error("Lỗi khi thêm sản phẩm:", error);
          toastr.error("Có lỗi khi thêm sản phẩm.");
        });
    } else {
      toastr.warning("Chưa chọn sản phẩm nào để thêm.");
    }
  };

  $scope.submitData = function () {
    $http
      .post("http://localhost:8080/chitietsanpham", $scope.chiTietSanPham)
      .then(function (response) {
        console.log("Tạo thành công:", response.data);
        toastr.success("Thêm mới thành công!", "Thông báo");
        const sanPhamId = response.data.sanPham.id;
        if (sanPhamId) {
          // Sử dụng $window để chuyển hướng
          $window.location.href = `/html/chitietsanpham.html?id=${sanPhamId}`;
        } else {
          console.error("Không có ID sản phẩm trong phản hồi.");
        }
      })
      .catch(function (error) {
        console.error("Lỗi khi tạo:", error);
      });
  };

  $scope.updateData = function (chiTietSanPham) {
    if (chiTietSanPham.id) {
      const updatedData = {
        id: chiTietSanPham.id,
        soLuong: chiTietSanPham.soLuong,
        giaNhap: chiTietSanPham.giaNhap,
        giaBan: chiTietSanPham.giaBan,
      };

      $http
        .put(
          `http://localhost:8080/chitietsanpham/${chiTietSanPham.id}`,
          updatedData
        )
        .then(function (response) {
          toastr.success("Cập nhật thành công!", "Thông báo");
          chiTietSanPham.isEditing = false; // Đóng form chỉnh sửa
          // Gọi lại dữ liệu để làm mới giao diện
          $scope.loadData(); // Hoặc gọi lại API để lấy dữ liệu mới
        })
        .catch(function (error) {
          toastr.error("Có lỗi xảy ra khi cập nhật!", "Thông báo");
        });
    } else {
      toastr.error("ID không hợp lệ!", "Thông báo");
    }
  };

  $scope.deleteData = function (id) {
    console.log("Deleting ID: ", id); // Kiểm tra ID đang xóa
    if (confirm("Bạn có chắc chắn muốn xóa chi tiết sản phẩm này?")) {
      $http.delete(`http://localhost:8080/chitietsanpham/${id}`).then(
        function (response) {
          $scope.loadData(); // Gọi lại danh sách sau khi xóa
          toastr.success("Xóa thành công!", "Thông báo");
        },
        function (error) {
          console.error("Lỗi khi xóa:", error); // Ghi lại lỗi chi tiết
          toastr.error("Xóa thất bại. Vui lòng thử lại!", "Thông báo");

          // Hiển thị thêm chi tiết lỗi
          if (error.data) {
            console.log("Chi tiết lỗi: ", error.data);
          } else {
            console.log("Không có dữ liệu lỗi trả về từ server.");
          }
        }
      );
    }
  };
});
