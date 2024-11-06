const app = angular.module("myApp", []);

app.controller("sanPhamController", function ($scope, $http) {
  // GET: lấy dữ liệu từ API và lưu vào $scope.sanPhams
  $http.get("http://localhost:8080/sanpham").then(
    function (response) {
      $scope.sanPhams = response.data;
      console.log(response.data); // Kiểm tra dữ liệu trả về từ API
    },
    function (error) {
      console.error("Lỗi khi lấy dữ liệu:", error);
    }
  );

  // Lấy dữ liệu chất liệu từ API
  $http.get("http://localhost:8080/chatlieu").then(function (response) {
    $scope.chatLieus = response.data;
  });

  // Lấy dữ liệu màu sắc từ API
  $http.get("http://localhost:8080/mausac").then(function (response) {
    $scope.mauSacs = response.data;
  });

  // Lấy dữ liệu kích cỡ từ API
  $http.get("http://localhost:8080/kichco").then(function (response) {
    $scope.kichCos = response.data;
  });

  // Hàm thêm kích cỡ vào danh sách
  $scope.addSize = function () {
    if (
      $scope.newKichCo &&
      !$scope.sanPham.kichCosDaChon.includes($scope.newKichCo)
    ) {
      $scope.sanPham.kichCosDaChon.push($scope.newKichCo);
      $scope.newKichCo = ""; // Reset ô nhập kích cỡ
    }
  };

  // Hàm thêm màu sắc vào danh sách
  $scope.addColor = function () {
    if (
      $scope.newMauSac &&
      !$scope.sanPham.mauSacsDaChon.includes($scope.newMauSac)
    ) {
      $scope.sanPham.mauSacsDaChon.push($scope.newMauSac);
      $scope.newMauSac = ""; // Reset ô nhập màu sắc
    }
  };
  // Hàm để lấy tên Màu sắc từ ID
  $scope.getMauSacName = function (id) {
    var mauSac = $scope.mauSacs.find(function (item) {
      return item.id === id;
    });
    return mauSac ? mauSac.tenMauSac : "";
  };

  // Hàm để lấy tên Kích cỡ từ ID
  $scope.getKichCoName = function (id) {
    var kichCo = $scope.kichCos.find(function (item) {
      return item.id === id;
    });
    return kichCo ? kichCo.soKichCo : "";
  };

  $scope.showForm = false; // Mặc định ẩn form thêm mới

  // Hàm để hiển thị form thêm sản phẩm mới
  $scope.showAddForm = function () {
    $scope.showForm = true; // Hiển thị form
  };

  // Hàm để quay lại danh sách sản phẩm
  $scope.backToList = function () {
    $scope.showForm = false; // Ẩn form
  };

  $scope.showProductDetails = false; // Ẩn phần chi tiết sản phẩm ban đầu

  $scope.submitDetails = function () {
    // Xử lý thêm chi tiết sản phẩm
    console.log("Chi tiết sản phẩm:", $scope.sanPham);
    // Sau khi thêm thành công, bạn có thể ẩn form hoặc thông báo thành công
  };

  $scope.sanPham = {
    id: null,
    tenSanPham: "",
    trangThai: "",
    danhMuc: { id: null },
    thuongHieu: { id: null },
    kichCosDaChon: [], // Danh sách kích cỡ đã chọn
    mauSacsDaChon: [], // Danh sách màu sắc đã chọn
  };

  // Gọi API để lấy số lượng theo id
  $http.get("http://localhost:8080/chitietsanpham/slsp").then(
    function (response) {
      $scope.soLuongData = {};
      console.log(response.data); // Kiểm tra dữ liệu trả về từ API
      response.data.forEach(function (item) {
        const idSanPham = item[0];
        const tongSoLuong = item[1];
        $scope.soLuongData[idSanPham] = tongSoLuong;
      });
    },
    function (error) {
      console.error("Lỗi khi lấy dữ liệu số lượng:", error);
    }
  );

  // Hàm để mở form thêm mới
  $scope.showAddForm = function () {
    $scope.showForm = true; // Hiển thị form
    $scope.resetForm(); // Reset dữ liệu form
  };

  // POST: Thêm mới sản phẩm
  $scope.submitData = function () {
    $http.post("http://localhost:8080/sanpham", $scope.sanPham).then(
      function (response) {
        console.log("Tạo thành công");
        $scope.getSanPhams(); // Cập nhật lại danh sách sau khi thêm mới

        $scope.resetForm(); // Reset form sau khi thêm mới
      },
      function (error) {
        console.error("Lỗi khi tạo:", error);
      }
    );
  };

  // Reset form
  $scope.resetForm = function () {
    $scope.sanPham = {
      id: null,
      tenSanPham: "",
      trangThai: "",
      danhMuc: { id: null },
      thuongHieu: { id: null },
    };
  };

  $scope.getSanPhams = function () {
    $http.get("http://localhost:8080/sanpham").then(
      function (response) {
        $scope.sanPhams = response.data;
      },
      function (error) {
        console.error("Lỗi khi lấy dữ liệu:", error);
      }
    );
  };

  // POST: Thêm mới danh mục
  $scope.themDanhMuc = function () {
    $http.post("http://localhost:8080/danhmuc", $scope.danhMuc).then(
      function (response) {
        console.log("Tạo thành công");
        $scope.danhMucs.push(response.data); // Cập nhật danh sách
        $scope.resetForm(); // Reset form sau khi thêm mới
      },
      function (error) {
        console.error("Lỗi khi tạo:", error);
      }
    );
  };

  // POST: Thêm mới thương hiệu
  $scope.themThuongHieu = function () {
    $http.post("http://localhost:8080/thuonghieu", $scope.thuongHieu).then(
      function (response) {
        console.log("Tạo thành công");
        $scope.thuongHieus.push(response.data); // Cập nhật danh sách
        $scope.resetForm(); // Reset form sau khi thêm mới
      },
      function (error) {
        console.error("Lỗi khi tạo:", error);
      }
    );
  };
});
