package com.example

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.compose.animation.AnimatedVisibility
import androidx.compose.animation.animateColorAsState
import androidx.compose.animation.core.RepeatMode
import androidx.compose.animation.core.animateFloat
import androidx.compose.animation.core.infiniteRepeatable
import androidx.compose.animation.core.rememberInfiniteTransition
import androidx.compose.animation.core.tween
import androidx.compose.animation.fadeIn
import androidx.compose.animation.fadeOut
import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.horizontalScroll
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.aspectRatio
import androidx.compose.foundation.layout.fillMaxHeight
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.navigationBarsPadding
import androidx.compose.foundation.layout.offset
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.statusBarsPadding
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.LazyRow
import androidx.compose.foundation.lazy.grid.GridCells
import androidx.compose.foundation.lazy.grid.LazyVerticalGrid
import androidx.compose.foundation.lazy.grid.items
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Add
import androidx.compose.material.icons.filled.ArrowBack
import androidx.compose.material.icons.filled.CheckCircle
import androidx.compose.material.icons.filled.Clear
import androidx.compose.material.icons.filled.Close
import androidx.compose.material.icons.filled.Discount
import androidx.compose.material.icons.filled.ElectricBolt
import androidx.compose.material.icons.filled.Favorite
import androidx.compose.material.icons.filled.FilterList
import androidx.compose.material.icons.filled.FlashOn
import androidx.compose.material.icons.filled.GridView
import androidx.compose.material.icons.filled.Home
import androidx.compose.material.icons.filled.KeyboardArrowDown
import androidx.compose.material.icons.filled.LocalShipping
import androidx.compose.material.icons.filled.LocationOn
import androidx.compose.material.icons.filled.Notifications
import androidx.compose.material.icons.filled.Person
import androidx.compose.material.icons.filled.Remove
import androidx.compose.material.icons.filled.Search
import androidx.compose.material.icons.filled.ShoppingCart
import androidx.compose.material.icons.filled.Sort
import androidx.compose.material.icons.filled.Star
import androidx.compose.material.icons.filled.Timer
import androidx.compose.material.icons.filled.Tune
import androidx.compose.material.icons.filled.Verified
import androidx.compose.material.icons.outlined.FavoriteBorder
import androidx.compose.material.icons.outlined.GridView
import androidx.compose.material.icons.outlined.Home
import androidx.compose.material.icons.outlined.Notifications
import androidx.compose.material.icons.outlined.Person
import androidx.compose.material.icons.outlined.ShoppingCart
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.HorizontalDivider
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.LinearProgressIndicator
import androidx.compose.material3.ModalBottomSheet
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.OutlinedTextFieldDefaults
import androidx.compose.material3.Scaffold
import androidx.compose.material3.SnackbarHost
import androidx.compose.material3.SnackbarHostState
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.material3.rememberModalBottomSheetState
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableIntStateOf
import androidx.compose.runtime.mutableStateListOf
import androidx.compose.runtime.mutableStateMapOf
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.draw.shadow
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.text.font.FontStyle
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.text.style.TextDecoration
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.ui.theme.*
import kotlinx.coroutines.delay
import kotlinx.coroutines.launch

// -----------------------------------------------------------------------------
// Extension Function for Currency Formatting
// -----------------------------------------------------------------------------
fun Int.formatWithCommas(): String {
  return String.format("%,d", this)
}

// -----------------------------------------------------------------------------
// Data Models
// -----------------------------------------------------------------------------
data class Product(
  val id: String,
  val name: String,
  val categoryId: String,
  val emoji: String,
  val price: Int,
  val originalPrice: Int,
  val stockCount: Int,
  val rating: Double,
  val reviewCount: Int,
  val description: String,
  val warehouse: String,
  val isFlashSale: Boolean = false,
  val claimedPct: Int = 0,
  val badge: String? = null,
  val deliveryTime: String = "10 Mins"
)

data class CategoryItem(
  val id: String,
  val label: String,
  val iconEmoji: String,
  val bgColor: Color,
  val textColor: Color,
  val badge: String? = null
)

data class NotificationItem(
  val id: String,
  val title: String,
  val message: String,
  val time: String,
  val type: String,
  val isUnread: Boolean = true
)

class MainActivity : ComponentActivity() {
  override fun onCreate(savedInstanceState: Bundle?) {
    super.onCreate(savedInstanceState)
    enableEdgeToEdge()
    setContent {
      MyApplicationTheme {
        ShopKartApp()
      }
    }
  }
}

// -----------------------------------------------------------------------------
// Main Composable Application
// -----------------------------------------------------------------------------
@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun ShopKartApp() {
  val snackbarHostState = remember { SnackbarHostState() }
  val scope = rememberCoroutineScope()

  // Navigation State
  var currentTab by remember { mutableStateOf("home") }

  // Search & Filter State
  var searchQuery by remember { mutableStateOf("") }
  var selectedCategory by remember { mutableStateOf("deals") }
  var selectedFilter by remember { mutableStateOf("All") }
  var selectedSort by remember { mutableStateOf("Popularity") }
  var showSortBottomSheet by remember { mutableStateOf(false) }

  // Wishlist state
  val wishlist = remember { mutableStateListOf<String>() }

  // Cart State (Map of Product ID to Quantity)
  val cartItems = remember { mutableStateMapOf<String, Int>() }

  // Notifications State
  val notificationsList = remember {
    mutableStateListOf(
      NotificationItem("n1", "⚡ Flash Sale Live!", "Sony WH-1000XM5 price dropped by ₹10,000! Only 2 left.", "10 mins ago", "deal"),
      NotificationItem("n2", "📦 Order Out for Delivery", "Your Apple Watch Series 9 (ODR-774120) is arriving today in 10 mins.", "1 hour ago", "order"),
      NotificationItem("n3", "🎉 Extra 20% OFF Coupon", "Use code FESTIVE20 on your cart to unlock instant 20% savings.", "3 hours ago", "promo")
    )
  }

  // Product Selection for Detail Sheet
  var selectedProductForDetail by remember { mutableStateOf<Product?>(null) }
  var showCartSheet by remember { mutableStateOf(false) }
  var showNotificationsSheet by remember { mutableStateOf(false) }
  var showOrderSuccessDialog by remember { mutableStateOf(false) }
  var lastCreatedOrderId by remember { mutableStateOf("") }

  // Applied Coupon State
  var appliedCoupon by remember { mutableStateOf<String?>(null) }
  var couponDiscountPercent by remember { mutableIntStateOf(0) }

  // Blinkit Style Categories Definition (Pastel & Cream Warm Palette)
  val categories = remember {
    listOf(
      CategoryItem("deals", "Flash Deals", "⚡", Color(0xFFFFF3CD), Color(0xFF856404), "HOT"),
      CategoryItem("mobiles", "Mobiles", "📱", Color(0xFFE0F2FE), Color(0xFF0369A1), "10 MIN"),
      CategoryItem("laptops", "Laptops", "💻", Color(0xFFEEF2FF), Color(0xFF4338CA), "PRO"),
      CategoryItem("audio", "Audio Gear", "🎧", Color(0xFFFCE7F3), Color(0xFFBE185D), "DEALS"),
      CategoryItem("fashion", "Fashion", "👕", Color(0xFFF3E8FF), Color(0xFF7E22CE), "NEW"),
      CategoryItem("home", "Home Appliances", "🏠", Color(0xFFDCFCE7), Color(0xFF15803D), "EASY"),
      CategoryItem("watches", "Smartwatches", "⌚", Color(0xFFEDE9FE), Color(0xFF6D28D9), "10 MIN"),
      CategoryItem("beauty", "Beauty & Care", "✨", Color(0xFFFEF3C7), Color(0xFFB45309), "POP"),
    )
  }

  // Catalog Products
  val products = remember {
    listOf(
      Product(
        id = "prod-1",
        name = "Sony WH-1000XM5 Headphones",
        categoryId = "audio",
        emoji = "🎧",
        price = 24990,
        originalPrice = 34990,
        stockCount = 2,
        rating = 4.9,
        reviewCount = 1420,
        description = "Industry-leading noise cancellation headphones with dual processors and 8 microphones for unparalleled clarity.",
        warehouse = "Mumbai Central WH-01",
        isFlashSale = true,
        claimedPct = 88,
        badge = "Only 2 Left!",
        deliveryTime = "10 Mins"
      ),
      Product(
        id = "prod-2",
        name = "Apple Watch Series 9 (45mm)",
        categoryId = "watches",
        emoji = "⌚",
        price = 41900,
        originalPrice = 45000,
        stockCount = 18,
        rating = 4.8,
        reviewCount = 890,
        description = "S9 SiP chip with double tap magic gesture, 2000 nits edge-to-edge Retina display, and ECG health tracking.",
        warehouse = "Bengaluru Tech Hub WH-04",
        badge = "In Stock",
        deliveryTime = "12 Mins"
      ),
      Product(
        id = "prod-3",
        name = "Apple iPhone 15 Pro Max 256GB",
        categoryId = "mobiles",
        emoji = "📱",
        price = 134900,
        originalPrice = 159900,
        stockCount = 3,
        rating = 4.9,
        reviewCount = 3240,
        description = "Forged in aerospace titanium with A17 Pro chip, custom Action button, and 5x optical telephoto lens.",
        warehouse = "Delhi Logistics Hub WH-02",
        isFlashSale = true,
        claimedPct = 92,
        badge = "Only 3 Left!",
        deliveryTime = "15 Mins"
      ),
      Product(
        id = "prod-4",
        name = "MacBook Pro 16\" M3 Max",
        categoryId = "laptops",
        emoji = "💻",
        price = 199900,
        originalPrice = 229900,
        stockCount = 7,
        rating = 5.0,
        reviewCount = 612,
        description = "Monster pro performance with Liquid Retina XDR display, 36GB unified memory, and 22-hour battery life.",
        warehouse = "Pune Western Hub WH-03",
        badge = "In Stock",
        deliveryTime = "20 Mins"
      ),
      Product(
        id = "prod-5",
        name = "Smart Air Purifier 4 Pro",
        categoryId = "home",
        emoji = "🏠",
        price = 14999,
        originalPrice = 19999,
        stockCount = 1,
        rating = 4.7,
        reviewCount = 450,
        description = "3-in-1 PM0.3 filtration system capturing 99.97% airborne allergens in 15 minutes with smart OLED display.",
        warehouse = "Mumbai Central WH-01",
        isFlashSale = true,
        claimedPct = 95,
        badge = "Only 1 Left!",
        deliveryTime = "10 Mins"
      ),
      Product(
        id = "prod-6",
        name = "Air Jordan 1 Retro High OG",
        categoryId = "fashion",
        emoji = "👕",
        price = 16995,
        originalPrice = 19995,
        stockCount = 12,
        rating = 4.8,
        reviewCount = 980,
        description = "Iconic basketball silhouette featuring premium full-grain leather and encapsulated Nike Air cushioning.",
        warehouse = "Delhi Logistics Hub WH-02",
        badge = "In Stock",
        deliveryTime = "15 Mins"
      ),
      Product(
        id = "prod-7",
        name = "Bose QuietComfort Ultra",
        categoryId = "audio",
        emoji = "🎧",
        price = 32900,
        originalPrice = 38900,
        stockCount = 4,
        rating = 4.8,
        reviewCount = 530,
        description = "Breakthrough spatial audio with CustomTune sound calibration tailored specifically to your ear contours.",
        warehouse = "Bengaluru Tech Hub WH-04",
        badge = "In Stock",
        deliveryTime = "10 Mins"
      ),
      Product(
        id = "prod-8",
        name = "Samsung Galaxy S24 Ultra 5G",
        categoryId = "mobiles",
        emoji = "📱",
        price = 129999,
        originalPrice = 144999,
        stockCount = 2,
        rating = 4.9,
        reviewCount = 2100,
        description = "Galaxy AI built-in with live call translate, Circle to Search, 200MP camera sensor, and integrated S-Pen.",
        warehouse = "Pune Western Hub WH-03",
        isFlashSale = true,
        claimedPct = 84,
        badge = "Only 2 Left!",
        deliveryTime = "12 Mins"
      )
    )
  }

  // Optimized Filter & Search Processing
  val filteredProducts = remember(searchQuery, selectedCategory, selectedFilter, selectedSort) {
    products.filter { p ->
      val matchesSearch = searchQuery.isBlank() ||
        p.name.contains(searchQuery, ignoreCase = true) ||
        p.description.contains(searchQuery, ignoreCase = true)
      
      val matchesCat = if (selectedCategory == "deals") true else p.categoryId == selectedCategory || selectedCategory == "cat-" + p.categoryId || p.categoryId == "cat-" + selectedCategory
      
      val matchesQuickFilter = when (selectedFilter) {
        "⚡ 10-Min Delivery" -> p.deliveryTime.contains("10")
        "🔥 > 30% Off" -> ((p.originalPrice - p.price) * 100 / p.originalPrice) >= 30
        "⭐ 4.8+ Rated" -> p.rating >= 4.8
        "Under ₹25,000" -> p.price <= 25000
        "In Stock" -> p.stockCount > 0
        else -> true
      }

      matchesSearch && matchesCat && matchesQuickFilter
    }.let { list ->
      when (selectedSort) {
        "Price: Low → High" -> list.sortedBy { it.price }
        "Price: High → Low" -> list.sortedByDescending { it.price }
        "Highest Discount" -> list.sortedByDescending { (it.originalPrice - it.price) * 100 / it.originalPrice }
        "Customer Rating" -> list.sortedByDescending { it.rating }
        else -> list
      }
    }
  }

  val totalCartCount = cartItems.values.sum()
  val unreadNotifCount = notificationsList.count { it.isUnread }

  Box(
    modifier = Modifier
      .fillMaxSize()
      .background(
        Brush.verticalGradient(
          colors = listOf(CreamCanvasStart, CreamCanvasEnd, Color(0xFFFAF2E4))
        )
      )
  ) {
    Scaffold(
      modifier = Modifier.fillMaxSize(),
      containerColor = Color.Transparent,
      snackbarHost = { SnackbarHost(snackbarHostState) },
      bottomBar = {
        BlinkitStyledBottomNavigation(
          currentTab = currentTab,
          onTabSelected = { currentTab = it },
          activityBadgeCount = unreadNotifCount,
          totalCartCount = totalCartCount,
          onQuickCartClick = { showCartSheet = true }
        )
      }
    ) { innerPadding ->
      Box(
        modifier = Modifier
          .fillMaxSize()
          .padding(bottom = innerPadding.calculateBottomPadding())
      ) {
        when (currentTab) {
          "home" -> {
            HomeScreenContent(
              categories = categories,
              selectedCategory = selectedCategory,
              onCategorySelected = { selectedCategory = it },
              searchQuery = searchQuery,
              onSearchQueryChange = { searchQuery = it },
              products = filteredProducts,
              selectedFilter = selectedFilter,
              onFilterSelected = { selectedFilter = it },
              selectedSort = selectedSort,
              onOpenSortModal = { showSortBottomSheet = true },
              unreadNotifCount = unreadNotifCount,
              totalCartCount = totalCartCount,
              onCartClick = { showCartSheet = true },
              onNotificationClick = { showNotificationsSheet = true },
              wishlist = wishlist,
              onToggleWishlist = { id ->
                if (wishlist.contains(id)) wishlist.remove(id) else wishlist.add(id)
              },
              cartItems = cartItems,
              onAddToCart = { product ->
                val current = cartItems[product.id] ?: 0
                if (current < product.stockCount) {
                  cartItems[product.id] = current + 1
                  scope.launch {
                    snackbarHostState.showSnackbar("⚡ Added ${product.name} to ShopKart Express Cart")
                  }
                } else {
                  scope.launch {
                    snackbarHostState.showSnackbar("Max stock (${product.stockCount}) reached!")
                  }
                }
              },
              onRemoveFromCart = { product ->
                val current = cartItems[product.id] ?: 0
                if (current > 1) {
                  cartItems[product.id] = current - 1
                } else {
                  cartItems.remove(product.id)
                }
              },
              onProductClick = { selectedProductForDetail = it }
            )
          }
          "categories" -> {
            BlinkitCategoriesPage(
              categories = categories,
              selectedCategory = selectedCategory,
              onCategorySelected = { selectedCategory = it },
              products = products,
              cartItems = cartItems,
              onAddToCart = { product ->
                val current = cartItems[product.id] ?: 0
                if (current < product.stockCount) {
                  cartItems[product.id] = current + 1
                }
              },
              onRemoveFromCart = { product ->
                val current = cartItems[product.id] ?: 0
                if (current > 1) {
                  cartItems[product.id] = current - 1
                } else {
                  cartItems.remove(product.id)
                }
              },
              onProductClick = { selectedProductForDetail = it }
            )
          }
          "activity" -> {
            ActivityScreenContent()
          }
          "profile" -> {
            ProfileScreenContent(
              onNavigateToOrders = { currentTab = "activity" },
              wishlistCount = wishlist.size,
              onShowSnackbar = { msg ->
                scope.launch { snackbarHostState.showSnackbar(msg) }
              }
            )
          }
        }
      }
    }

    // -------------------------------------------------------------------------
    // Sort Bottom Sheet Modal
    // -------------------------------------------------------------------------
    if (showSortBottomSheet) {
      ModalBottomSheet(
        onDismissRequest = { showSortBottomSheet = false },
        containerColor = SurfaceWhite,
        shape = RoundedCornerShape(topStart = 24.dp, topEnd = 24.dp)
      ) {
        Column(
          modifier = Modifier
            .fillMaxWidth()
            .padding(20.dp)
            .navigationBarsPadding(),
          verticalArrangement = Arrangement.spacedBy(12.dp)
        ) {
          Text(text = "Sort Products By", style = Typography.titleLarge, fontWeight = FontWeight.Black, color = Slate900)
          listOf("Popularity", "Price: Low → High", "Price: High → Low", "Highest Discount", "Customer Rating").forEach { sortOpt ->
            Row(
              modifier = Modifier
                .fillMaxWidth()
                .background(if (selectedSort == sortOpt) PrimaryBlueContainer else CreamSurfaceVariant, RoundedCornerShape(12.dp))
                .border(1.dp, if (selectedSort == sortOpt) PrimaryBlue else CreamCardBorder, RoundedCornerShape(12.dp))
                .clickable {
                  selectedSort = sortOpt
                  showSortBottomSheet = false
                }
                .padding(14.dp),
              horizontalArrangement = Arrangement.SpaceBetween,
              verticalAlignment = Alignment.CenterVertically
            ) {
              Text(text = sortOpt, style = Typography.bodyMedium, fontWeight = FontWeight.Bold, color = if (selectedSort == sortOpt) PrimaryBlueDark else Slate900)
              if (selectedSort == sortOpt) {
                Icon(imageVector = Icons.Filled.CheckCircle, contentDescription = null, tint = PrimaryBlue, modifier = Modifier.size(18.dp))
              }
            }
          }
        }
      }
    }

    // -------------------------------------------------------------------------
    // Notifications Drawer
    // -------------------------------------------------------------------------
    if (showNotificationsSheet) {
      ModalBottomSheet(
        onDismissRequest = { showNotificationsSheet = false },
        containerColor = SurfaceWhite,
        shape = RoundedCornerShape(topStart = 24.dp, topEnd = 24.dp)
      ) {
        Column(
          modifier = Modifier
            .fillMaxWidth()
            .padding(horizontal = 20.dp)
            .padding(bottom = 28.dp)
            .navigationBarsPadding(),
          verticalArrangement = Arrangement.spacedBy(16.dp)
        ) {
          Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically
          ) {
            Row(verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.spacedBy(8.dp)) {
              Icon(imageVector = Icons.Filled.Notifications, contentDescription = null, tint = PrimaryBlue, modifier = Modifier.size(22.dp))
              Text(text = "ShopKart Alerts", style = Typography.titleLarge, fontWeight = FontWeight.Black, color = Slate900)
            }
            IconButton(onClick = { showNotificationsSheet = false }) {
              Icon(imageVector = Icons.Filled.Close, contentDescription = "Close", tint = Slate500)
            }
          }

          LazyColumn(
            modifier = Modifier.fillMaxWidth(),
            verticalArrangement = Arrangement.spacedBy(10.dp)
          ) {
            items(notificationsList) { notif ->
              Card(
                modifier = Modifier
                  .fillMaxWidth()
                  .clickable {
                    val idx = notificationsList.indexOf(notif)
                    if (idx >= 0) notificationsList[idx] = notif.copy(isUnread = false)
                  },
                shape = RoundedCornerShape(14.dp),
                colors = CardDefaults.cardColors(containerColor = if (notif.isUnread) PrimaryBlueLight else CreamSurfaceVariant),
                border = BorderStroke(1.dp, if (notif.isUnread) PrimaryBlueContainer else CreamCardBorder)
              ) {
                Column(modifier = Modifier.padding(14.dp), verticalArrangement = Arrangement.spacedBy(4.dp)) {
                  Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                  ) {
                    Text(text = notif.title, style = Typography.titleMedium, fontWeight = FontWeight.Bold, color = Slate900)
                    Text(text = notif.time, style = Typography.bodySmall, color = Slate500)
                  }
                  Text(text = notif.message, style = Typography.bodyMedium, color = Slate700)
                }
              }
            }
          }
        }
      }
    }

    // -------------------------------------------------------------------------
    // Product Detail Sheet
    // -------------------------------------------------------------------------
    if (selectedProductForDetail != null) {
      val sheetState = rememberModalBottomSheetState(skipPartiallyExpanded = true)
      val product = selectedProductForDetail!!
      val qtyInCart = cartItems[product.id] ?: 0

      ModalBottomSheet(
        onDismissRequest = { selectedProductForDetail = null },
        sheetState = sheetState,
        containerColor = SurfaceWhite,
        shape = RoundedCornerShape(topStart = 24.dp, topEnd = 24.dp)
      ) {
        Column(
          modifier = Modifier
            .fillMaxWidth()
            .padding(horizontal = 24.dp)
            .padding(bottom = 32.dp)
            .navigationBarsPadding(),
          verticalArrangement = Arrangement.spacedBy(16.dp)
        ) {
          Box(
            modifier = Modifier
              .fillMaxWidth()
              .height(200.dp)
              .clip(RoundedCornerShape(20.dp))
              .background(CreamSurfaceVariant)
              .border(1.dp, CreamCardBorder, RoundedCornerShape(20.dp)),
            contentAlignment = Alignment.Center
          ) {
            Text(text = product.emoji, fontSize = 76.sp)

            Box(
              modifier = Modifier
                .align(Alignment.TopStart)
                .padding(12.dp)
            ) {
              PoppedBadge(text = "⚡ ${product.deliveryTime}", bgColor = BlinkitYellow, textColor = Color.Black)
            }

            IconButton(
              onClick = {
                if (wishlist.contains(product.id)) wishlist.remove(product.id) else wishlist.add(product.id)
              },
              modifier = Modifier
                .align(Alignment.TopEnd)
                .padding(8.dp)
                .background(Color.White.copy(alpha = 0.8f), CircleShape)
                .size(36.dp)
            ) {
              Icon(
                imageVector = if (wishlist.contains(product.id)) Icons.Filled.Favorite else Icons.Outlined.FavoriteBorder,
                contentDescription = "Wishlist",
                tint = if (wishlist.contains(product.id)) UrgentRed else Slate400,
                modifier = Modifier.size(20.dp)
              )
            }
          }

          Column {
            Row(
              verticalAlignment = Alignment.CenterVertically,
              horizontalArrangement = Arrangement.spacedBy(6.dp)
            ) {
              Icon(imageVector = Icons.Filled.ElectricBolt, contentDescription = null, tint = BlinkitGreen, modifier = Modifier.size(18.dp))
              Text(text = "ShopKart Express • Delivered in 10 Mins", style = Typography.labelSmall, color = BlinkitGreen, fontWeight = FontWeight.Bold)
            }
            Spacer(modifier = Modifier.height(4.dp))
            Text(
              text = product.name,
              style = Typography.titleLarge,
              color = Slate900,
              fontWeight = FontWeight.Black
            )
            Row(
              verticalAlignment = Alignment.CenterVertically,
              horizontalArrangement = Arrangement.spacedBy(4.dp),
              modifier = Modifier.padding(top = 4.dp)
            ) {
              Icon(imageVector = Icons.Filled.Star, contentDescription = null, tint = GoldStar, modifier = Modifier.size(16.dp))
              Text(text = "${product.rating}", style = Typography.bodyMedium, fontWeight = FontWeight.Bold, color = Slate900)
              Text(text = "(${product.reviewCount} reviews)", style = Typography.bodySmall, color = Slate500)
            }
          }

          Row(
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.spacedBy(8.dp)
          ) {
            Text(
              text = "₹${product.price.formatWithCommas()}",
              style = Typography.headlineMedium,
              color = BlinkitGreen,
              fontWeight = FontWeight.Black
            )
            Text(
              text = "₹${product.originalPrice.formatWithCommas()}",
              style = Typography.bodyMedium,
              color = Slate400,
              textDecoration = TextDecoration.LineThrough
            )
            val discountPct = ((product.originalPrice - product.price) * 100) / product.originalPrice
            PoppedBadge(text = "$discountPct% OFF", bgColor = SuccessGreenBg, textColor = BlinkitGreen)
          }

          Text(
            text = product.description,
            style = Typography.bodyMedium,
            color = Slate600,
            lineHeight = 20.sp
          )

          Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.spacedBy(12.dp)
          ) {
            Button(
              onClick = {
                val current = cartItems[product.id] ?: 0
                if (current < product.stockCount) {
                  cartItems[product.id] = current + 1
                  scope.launch {
                    snackbarHostState.showSnackbar("Added ${product.name} to cart")
                  }
                }
              },
              modifier = Modifier
                .weight(1f)
                .height(50.dp)
                .testTag("modal_add_to_cart"),
              colors = ButtonDefaults.buttonColors(containerColor = BlinkitGreenLight, contentColor = BlinkitGreen),
              shape = RoundedCornerShape(14.dp),
              border = BorderStroke(1.5.dp, BlinkitGreen)
            ) {
              Text(
                text = if (qtyInCart > 0) "In Cart ($qtyInCart)" else "+ ADD",
                fontWeight = FontWeight.Black,
                style = Typography.titleMedium
              )
            }

            Button(
              onClick = {
                if ((cartItems[product.id] ?: 0) == 0) {
                  cartItems[product.id] = 1
                }
                selectedProductForDetail = null
                showCartSheet = true
              },
              modifier = Modifier
                .weight(1f)
                .height(50.dp)
                .testTag("modal_buy_now"),
              colors = ButtonDefaults.buttonColors(containerColor = BlinkitGreen, contentColor = Color.White),
              shape = RoundedCornerShape(14.dp)
            ) {
              Text(text = "Quick Checkout", fontWeight = FontWeight.Black, style = Typography.titleMedium)
            }
          }
        }
      }
    }

    // -------------------------------------------------------------------------
    // Cart Bottom Sheet
    // -------------------------------------------------------------------------
    if (showCartSheet) {
      val cartSheetState = rememberModalBottomSheetState(skipPartiallyExpanded = true)
      val cartList = products.filter { (cartItems[it.id] ?: 0) > 0 }
      val subtotal = cartList.sumOf { it.price * (cartItems[it.id] ?: 0) }
      val totalDiscount = (subtotal * couponDiscountPercent) / 100
      val deliveryFee = if (subtotal > 500 || subtotal == 0) 0 else 25
      val finalTotal = (subtotal - totalDiscount) + deliveryFee

      ModalBottomSheet(
        onDismissRequest = { showCartSheet = false },
        sheetState = cartSheetState,
        containerColor = SurfaceWhite,
        shape = RoundedCornerShape(topStart = 24.dp, topEnd = 24.dp)
      ) {
        Column(
          modifier = Modifier
            .fillMaxWidth()
            .padding(horizontal = 20.dp)
            .padding(bottom = 28.dp)
            .navigationBarsPadding(),
          verticalArrangement = Arrangement.spacedBy(16.dp)
        ) {
          Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically
          ) {
            Row(verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.spacedBy(8.dp)) {
              Text(text = "⚡ ShopKart Express Cart", style = Typography.titleLarge, fontWeight = FontWeight.Black, color = Slate900)
              PoppedBadge(text = "${cartList.size} items", bgColor = BlinkitYellow, textColor = Color.Black)
            }
            IconButton(onClick = { showCartSheet = false }) {
              Icon(imageVector = Icons.Filled.Close, contentDescription = "Close", tint = Slate500)
            }
          }

          if (cartList.isEmpty()) {
            Column(
              modifier = Modifier
                .fillMaxWidth()
                .padding(vertical = 48.dp),
              horizontalAlignment = Alignment.CenterHorizontally,
              verticalArrangement = Arrangement.spacedBy(12.dp)
            ) {
              Text(text = "⚡", fontSize = 48.sp)
              Text(text = "Your ShopKart cart is empty", style = Typography.titleMedium, fontWeight = FontWeight.Bold, color = Slate900)
              Text(text = "Add items to unlock 10-minute instant delivery.", style = Typography.bodySmall, color = Slate500)
              Button(
                onClick = { showCartSheet = false },
                shape = RoundedCornerShape(12.dp),
                colors = ButtonDefaults.buttonColors(containerColor = BlinkitGreen, contentColor = Color.White)
              ) {
                Text("Explore Flash Deals", fontWeight = FontWeight.Black)
              }
            }
          } else {
            LazyColumn(
              modifier = Modifier
                .fillMaxWidth()
                .height(240.dp),
              verticalArrangement = Arrangement.spacedBy(10.dp)
            ) {
              items(cartList) { item ->
                val count = cartItems[item.id] ?: 0
                Row(
                  modifier = Modifier
                    .fillMaxWidth()
                    .background(CreamCardBg, RoundedCornerShape(14.dp))
                    .border(1.dp, CreamCardBorder, RoundedCornerShape(14.dp))
                    .padding(12.dp),
                  verticalAlignment = Alignment.CenterVertically,
                  horizontalArrangement = Arrangement.spacedBy(12.dp)
                ) {
                  Box(
                    modifier = Modifier
                      .size(54.dp)
                      .background(CreamSurfaceVariant, RoundedCornerShape(10.dp))
                      .border(1.dp, CreamCardBorder, RoundedCornerShape(10.dp)),
                    contentAlignment = Alignment.Center
                  ) {
                    Text(text = item.emoji, fontSize = 28.sp)
                  }

                  Column(modifier = Modifier.weight(1f)) {
                    Text(
                      text = item.name,
                      style = Typography.titleMedium,
                      fontWeight = FontWeight.Bold,
                      color = Slate900,
                      maxLines = 1,
                      overflow = TextOverflow.Ellipsis
                    )
                    Text(
                      text = "₹${item.price.formatWithCommas()}",
                      style = Typography.bodyMedium,
                      fontWeight = FontWeight.ExtraBold,
                      color = BlinkitGreen
                    )
                  }

                  Row(
                    verticalAlignment = Alignment.CenterVertically,
                    horizontalArrangement = Arrangement.spacedBy(6.dp),
                    modifier = Modifier
                      .background(BlinkitGreen, RoundedCornerShape(8.dp))
                      .padding(horizontal = 4.dp, vertical = 2.dp)
                  ) {
                    Text(
                      text = "-",
                      fontWeight = FontWeight.Black,
                      fontSize = 18.sp,
                      color = Color.White,
                      modifier = Modifier
                        .padding(horizontal = 8.dp)
                        .clickable {
                          if (count > 1) {
                            cartItems[item.id] = count - 1
                          } else {
                            cartItems.remove(item.id)
                          }
                        }
                    )
                    Text(text = "$count", fontWeight = FontWeight.Black, fontSize = 14.sp, color = Color.White)
                    Text(
                      text = "+",
                      fontWeight = FontWeight.Black,
                      fontSize = 18.sp,
                      color = Color.White,
                      modifier = Modifier
                        .padding(horizontal = 8.dp)
                        .clickable {
                          if (count < item.stockCount) {
                            cartItems[item.id] = count + 1
                          }
                        }
                    )
                  }
                }
              }
            }

            Surface(
              color = if (appliedCoupon != null) SuccessGreenBg else CreamSurfaceVariant,
              shape = RoundedCornerShape(12.dp),
              border = BorderStroke(1.dp, if (appliedCoupon != null) SuccessGreenBorder else CreamCardBorder),
              modifier = Modifier.fillMaxWidth()
            ) {
              Row(
                modifier = Modifier
                  .fillMaxWidth()
                  .padding(horizontal = 12.dp, vertical = 8.dp),
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.SpaceBetween
              ) {
                Row(verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                  Icon(
                    imageVector = Icons.Filled.Discount,
                    contentDescription = null,
                    tint = BlinkitGreen,
                    modifier = Modifier.size(18.dp)
                  )
                  Text(
                    text = if (appliedCoupon != null) "Coupon: $appliedCoupon (20% OFF applied)" else "Have code? Use FESTIVE20",
                    style = Typography.bodySmall,
                    fontWeight = FontWeight.Bold,
                    color = if (appliedCoupon != null) BlinkitGreen else Slate900
                  )
                }
                if (appliedCoupon == null) {
                  Text(
                    text = "Apply",
                    style = Typography.labelMedium,
                    color = PrimaryBlue,
                    fontWeight = FontWeight.Black,
                    modifier = Modifier
                      .clickable {
                        appliedCoupon = "FESTIVE20"
                        couponDiscountPercent = 20
                      }
                      .padding(4.dp)
                  )
                } else {
                  Text(
                    text = "Remove",
                    style = Typography.labelMedium,
                    color = UrgentRed,
                    fontWeight = FontWeight.Bold,
                    modifier = Modifier
                      .clickable {
                        appliedCoupon = null
                        couponDiscountPercent = 0
                      }
                      .padding(4.dp)
                  )
                }
              }
            }

            Column(
              modifier = Modifier
                .fillMaxWidth()
                .background(CreamSurfaceVariant, RoundedCornerShape(16.dp))
                .border(1.dp, CreamCardBorder, RoundedCornerShape(16.dp))
                .padding(16.dp),
              verticalArrangement = Arrangement.spacedBy(8.dp)
            ) {
              Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween) {
                Text(text = "Subtotal", style = Typography.bodySmall, color = Slate600)
                Text(text = "₹${subtotal.formatWithCommas()}", style = Typography.bodyMedium, color = Slate900, fontWeight = FontWeight.Bold)
              }
              if (totalDiscount > 0) {
                Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween) {
                  Text(text = "Promo Discount (20%)", style = Typography.bodySmall, color = BlinkitGreen)
                  Text(text = "-₹${totalDiscount.formatWithCommas()}", style = Typography.bodyMedium, color = BlinkitGreen, fontWeight = FontWeight.Bold)
                }
              }
              Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween) {
                Text(text = "10-Min Delivery Charge", style = Typography.bodySmall, color = Slate600)
                Text(
                  text = if (deliveryFee == 0) "FREE" else "₹$deliveryFee",
                  style = Typography.bodyMedium,
                  color = if (deliveryFee == 0) BlinkitGreen else Slate900,
                  fontWeight = FontWeight.Bold
                )
              }
              HorizontalDivider(color = CreamCardBorder, modifier = Modifier.padding(vertical = 4.dp))
              Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
              ) {
                Text(text = "Total Payable", style = Typography.titleMedium, color = Slate900, fontWeight = FontWeight.Bold)
                Text(text = "₹${finalTotal.formatWithCommas()}", style = Typography.titleLarge, color = BlinkitGreen, fontWeight = FontWeight.Black)
              }
            }

            Button(
              onClick = {
                lastCreatedOrderId = "SHOPKART-${System.currentTimeMillis().toString().takeLast(6)}"
                cartItems.clear()
                showCartSheet = false
                showOrderSuccessDialog = true
              },
              modifier = Modifier
                .fillMaxWidth()
                .height(52.dp)
                .testTag("checkout_order_button"),
              colors = ButtonDefaults.buttonColors(containerColor = BlinkitGreen, contentColor = Color.White),
              shape = RoundedCornerShape(14.dp)
            ) {
              Text(text = "⚡ Place Instant Order • ₹${finalTotal.formatWithCommas()}", fontWeight = FontWeight.Black, style = Typography.titleMedium)
            }
          }
        }
      }
    }

    // -------------------------------------------------------------------------
    // Order Success Sheet
    // -------------------------------------------------------------------------
    if (showOrderSuccessDialog) {
      ModalBottomSheet(
        onDismissRequest = { showOrderSuccessDialog = false },
        containerColor = SurfaceWhite,
        shape = RoundedCornerShape(topStart = 24.dp, topEnd = 24.dp)
      ) {
        Column(
          modifier = Modifier
            .fillMaxWidth()
            .padding(24.dp)
            .padding(bottom = 32.dp)
            .navigationBarsPadding(),
          horizontalAlignment = Alignment.CenterHorizontally,
          verticalArrangement = Arrangement.spacedBy(16.dp)
        ) {
          Box(
            modifier = Modifier
              .size(72.dp)
              .background(SuccessGreenBg, CircleShape)
              .border(2.dp, BlinkitGreen, CircleShape),
            contentAlignment = Alignment.Center
          ) {
            Icon(imageVector = Icons.Filled.CheckCircle, contentDescription = null, tint = BlinkitGreen, modifier = Modifier.size(40.dp))
          }

          Text(text = "Order Placed in 10 Mins!", style = Typography.headlineMedium, color = Slate900, fontWeight = FontWeight.Black)
          Text(
            text = "Order ID: $lastCreatedOrderId\nDelivery partner assigned! Your order is being packed at Bengaluru Dark Store and will reach you in 10 minutes.",
            style = Typography.bodyMedium,
            color = Slate600,
            textAlign = TextAlign.Center
          )

          Button(
            onClick = {
              showOrderSuccessDialog = false
              currentTab = "activity"
            },
            modifier = Modifier
              .fillMaxWidth()
              .height(48.dp),
            colors = ButtonDefaults.buttonColors(containerColor = BlinkitGreen, contentColor = Color.White),
            shape = RoundedCornerShape(12.dp)
          ) {
            Text(text = "Track Live Delivery 🛵", fontWeight = FontWeight.Black)
          }
        }
      }
    }
  }
}

// -----------------------------------------------------------------------------
// Blinkit / ShopKart Bottom Navigation Bar
// -----------------------------------------------------------------------------
@Composable
fun BlinkitStyledBottomNavigation(
  currentTab: String,
  onTabSelected: (String) -> Unit,
  activityBadgeCount: Int,
  totalCartCount: Int,
  onQuickCartClick: () -> Unit
) {
  Surface(
    color = SurfaceWhite,
    border = BorderStroke(1.dp, CreamCardBorder),
    modifier = Modifier.fillMaxWidth()
  ) {
    Row(
      modifier = Modifier
        .fillMaxWidth()
        .navigationBarsPadding()
        .height(64.dp)
        .padding(horizontal = 8.dp),
      horizontalArrangement = Arrangement.SpaceAround,
      verticalAlignment = Alignment.CenterVertically
    ) {
      listOf(
        Triple("home", "Home", Icons.Filled.Home),
        Triple("categories", "Categories", Icons.Filled.GridView),
        Triple("activity", "Orders", Icons.Filled.ShoppingCart),
        Triple("profile", "Profile", Icons.Filled.Person)
      ).forEach { (id, label, icon) ->
        val isSelected = currentTab == id
        Column(
          horizontalAlignment = Alignment.CenterHorizontally,
          modifier = Modifier
            .weight(1f)
            .clickable { onTabSelected(id) }
            .padding(vertical = 4.dp)
        ) {
          Box(contentAlignment = Alignment.Center) {
            Icon(
              imageVector = icon,
              contentDescription = label,
              tint = if (isSelected) BlinkitGreen else Slate400,
              modifier = Modifier.size(22.dp)
            )
            if (id == "activity" && activityBadgeCount > 0) {
              Box(
                modifier = Modifier
                  .align(Alignment.TopEnd)
                  .offset(x = 6.dp, y = (-4).dp)
                  .size(12.dp)
                  .background(UrgentRed, CircleShape)
              )
            }
          }
          Text(
            text = label,
            fontSize = 11.sp,
            fontWeight = if (isSelected) FontWeight.Black else FontWeight.Medium,
            color = if (isSelected) BlinkitGreen else Slate600,
            modifier = Modifier.padding(top = 2.dp)
          )
        }
      }

      if (totalCartCount > 0) {
        Surface(
          color = BlinkitGreen,
          shape = RoundedCornerShape(12.dp),
          modifier = Modifier
            .clickable { onQuickCartClick() }
            .padding(end = 4.dp)
        ) {
          Row(
            modifier = Modifier.padding(horizontal = 10.dp, vertical = 6.dp),
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.spacedBy(4.dp)
          ) {
            Icon(imageVector = Icons.Filled.ShoppingCart, contentDescription = null, tint = Color.White, modifier = Modifier.size(16.dp))
            Text(text = "$totalCartCount", fontWeight = FontWeight.Black, fontSize = 12.sp, color = Color.White)
          }
        }
      }
    }
  }
}

// -----------------------------------------------------------------------------
// Home Screen Content with Optimized Search, Popped Cards & High Density
// -----------------------------------------------------------------------------
@Composable
fun HomeScreenContent(
  categories: List<CategoryItem>,
  selectedCategory: String,
  onCategorySelected: (String) -> Unit,
  searchQuery: String,
  onSearchQueryChange: (String) -> Unit,
  products: List<Product>,
  selectedFilter: String,
  onFilterSelected: (String) -> Unit,
  selectedSort: String,
  onOpenSortModal: () -> Unit,
  unreadNotifCount: Int,
  totalCartCount: Int,
  onCartClick: () -> Unit,
  onNotificationClick: () -> Unit,
  wishlist: List<String>,
  onToggleWishlist: (String) -> Unit,
  cartItems: Map<String, Int>,
  onAddToCart: (Product) -> Unit,
  onRemoveFromCart: (Product) -> Unit,
  onProductClick: (Product) -> Unit
) {
  LazyColumn(
    modifier = Modifier.fillMaxSize(),
    contentPadding = PaddingValues(bottom = 24.dp)
  ) {
    // 1. Top Modern Location & Brand Header
    item {
      BlinkitLocationHeader(
        unreadNotifCount = unreadNotifCount,
        totalCartCount = totalCartCount,
        onNotificationClick = onNotificationClick,
        onCartClick = onCartClick
      )
    }

    // 2. High Pop Search Bar with Filter Trigger
    item {
      BlinkitSearchBar(
        searchQuery = searchQuery,
        onSearchQueryChange = onSearchQueryChange,
        selectedSort = selectedSort,
        onOpenSortModal = onOpenSortModal
      )
    }

    // 3. Quick Filter Chips Bar
    item {
      QuickFilterChipsRow(
        selectedFilter = selectedFilter,
        onFilterSelected = onFilterSelected
      )
    }

    // 4. Category Horizontal Bar
    item {
      BlinkitCategoriesRow(
        categories = categories,
        selectedCategory = selectedCategory,
        onCategorySelected = onCategorySelected
      )
    }

    // 5. Auto-Scrolling Carousel Banner
    item {
      Box(modifier = Modifier.padding(horizontal = 16.dp, vertical = 6.dp)) {
        AutoScrollingBannerCarousel()
      }
    }

    // 6. Live Flash Sale Section with Countdown Ticker
    item {
      FlashSaleTickerSection(
        products = products.filter { it.isFlashSale },
        cartItems = cartItems,
        onProductClick = onProductClick,
        onAddToCart = onAddToCart,
        onRemoveFromCart = onRemoveFromCart
      )
    }

    // 7. Product Results Section Header
    item {
      Row(
        modifier = Modifier
          .fillMaxWidth()
          .padding(horizontal = 16.dp, vertical = 8.dp),
        horizontalArrangement = Arrangement.SpaceBetween,
        verticalAlignment = Alignment.CenterVertically
      ) {
        Row(verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.spacedBy(6.dp)) {
          Text(text = "⚡ Instant Delivery Products", style = Typography.titleMedium, fontWeight = FontWeight.Black, color = Slate900)
          PoppedBadge(text = "${products.size} Items", bgColor = CreamSurfaceVariant, textColor = PrimaryBlueDark)
        }
      }
    }

    // 8. Popped Product Cards Grid
    if (products.isEmpty()) {
      item {
        Column(
          modifier = Modifier
            .fillMaxWidth()
            .padding(vertical = 40.dp),
          horizontalAlignment = Alignment.CenterHorizontally,
          verticalArrangement = Arrangement.spacedBy(8.dp)
        ) {
          Text(text = "🔍", fontSize = 36.sp)
          Text(text = "No matching items found", style = Typography.titleMedium, fontWeight = FontWeight.Bold, color = Slate900)
          Text(text = "Try clearing filters or searching for another item.", style = Typography.bodySmall, color = Slate600)
        }
      }
    } else {
      val rows = products.chunked(2)
      items(rows) { pair ->
        Row(
          modifier = Modifier
            .fillMaxWidth()
            .padding(horizontal = 16.dp, vertical = 6.dp),
          horizontalArrangement = Arrangement.spacedBy(12.dp)
        ) {
          for (product in pair) {
            Box(modifier = Modifier.weight(1f)) {
              PoppedProductCard(
                product = product,
                isWishlisted = wishlist.contains(product.id),
                onToggleWishlist = { onToggleWishlist(product.id) },
                qtyInCart = cartItems[product.id] ?: 0,
                onAddToCart = { onAddToCart(product) },
                onRemoveFromCart = { onRemoveFromCart(product) },
                onClick = { onProductClick(product) }
              )
            }
          }
          if (pair.size == 1) {
            Spacer(modifier = Modifier.weight(1f))
          }
        }
      }
    }
  }
}

// -----------------------------------------------------------------------------
// Blinkit Style Categories Page (Split-Screen Sidebar Navigation)
// -----------------------------------------------------------------------------
@Composable
fun BlinkitCategoriesPage(
  categories: List<CategoryItem>,
  selectedCategory: String,
  onCategorySelected: (String) -> Unit,
  products: List<Product>,
  cartItems: Map<String, Int>,
  onAddToCart: (Product) -> Unit,
  onRemoveFromCart: (Product) -> Unit,
  onProductClick: (Product) -> Unit
) {
  Row(
    modifier = Modifier
      .fillMaxSize()
      .statusBarsPadding()
  ) {
    // Left Category Sidebar
    LazyColumn(
      modifier = Modifier
        .width(100.dp)
        .fillMaxHeight()
        .background(CreamSurfaceVariant)
        .border(BorderStroke(1.dp, CreamCardBorder)),
      contentPadding = PaddingValues(vertical = 12.dp)
    ) {
      items(categories) { cat ->
        val isSelected = cat.id == selectedCategory
        Column(
          horizontalAlignment = Alignment.CenterHorizontally,
          modifier = Modifier
            .fillMaxWidth()
            .clickable { onCategorySelected(cat.id) }
            .padding(vertical = 10.dp)
        ) {
          Box(
            modifier = Modifier
              .size(52.dp)
              .clip(RoundedCornerShape(16.dp))
              .background(if (isSelected) cat.bgColor else CreamCardBg)
              .border(
                1.5.dp,
                if (isSelected) cat.textColor else CreamCardBorder,
                RoundedCornerShape(16.dp)
              ),
            contentAlignment = Alignment.Center
          ) {
            Text(text = cat.iconEmoji, fontSize = 24.sp)
          }

          Text(
            text = cat.label,
            fontSize = 11.sp,
            fontWeight = if (isSelected) FontWeight.Black else FontWeight.Bold,
            color = if (isSelected) cat.textColor else Slate700,
            textAlign = TextAlign.Center,
            modifier = Modifier.padding(start = 4.dp, end = 4.dp, top = 4.dp),
            maxLines = 1,
            overflow = TextOverflow.Ellipsis
          )

          cat.badge?.let {
            PoppedBadge(text = it, bgColor = if (isSelected) cat.textColor else CreamCardBorder, textColor = if (isSelected) Color.White else Slate600)
          }
        }
      }
    }

    // Right Subcategory / Product Stream
    Column(
      modifier = Modifier
        .weight(1f)
        .fillMaxHeight()
        .padding(horizontal = 12.dp, vertical = 8.dp)
    ) {
      // Header for Selected Category
      val activeCat = categories.find { it.id == selectedCategory } ?: categories.first()
      Surface(
        color = activeCat.bgColor,
        shape = RoundedCornerShape(16.dp),
        border = BorderStroke(1.dp, activeCat.textColor),
        modifier = Modifier.fillMaxWidth()
      ) {
        Row(
          modifier = Modifier.padding(12.dp),
          verticalAlignment = Alignment.CenterVertically,
          horizontalArrangement = Arrangement.spacedBy(10.dp)
        ) {
          Text(text = activeCat.iconEmoji, fontSize = 28.sp)
          Column {
            Text(text = activeCat.label, style = Typography.titleMedium, fontWeight = FontWeight.Black, color = activeCat.textColor)
            Text(text = "⚡ Delivered in 10 minutes", style = Typography.bodySmall, color = Slate800)
          }
        }
      }

      Spacer(modifier = Modifier.height(10.dp))

      val categoryProducts = if (selectedCategory == "deals") products else products.filter { it.categoryId == selectedCategory || selectedCategory == "cat-" + it.categoryId || it.categoryId == "cat-" + selectedCategory }

      LazyColumn(
        modifier = Modifier.fillMaxSize(),
        verticalArrangement = Arrangement.spacedBy(10.dp)
      ) {
        items(categoryProducts) { product ->
          HorizontalPoppedProductCard(
            product = product,
            qtyInCart = cartItems[product.id] ?: 0,
            onAddToCart = { onAddToCart(product) },
            onRemoveFromCart = { onRemoveFromCart(product) },
            onClick = { onProductClick(product) }
          )
        }

        item {
          Text(
            text = "Frequently Bought Together",
            style = Typography.titleSmall,
            fontWeight = FontWeight.Black,
            color = BlinkitGreen,
            modifier = Modifier.padding(top = 12.dp, bottom = 6.dp)
          )
        }

        item {
          LazyRow(
            horizontalArrangement = Arrangement.spacedBy(10.dp)
          ) {
            items(products.take(4)) { prod ->
              Box(modifier = Modifier.width(140.dp)) {
                PoppedProductCard(
                  product = prod,
                  isWishlisted = false,
                  onToggleWishlist = {},
                  qtyInCart = cartItems[prod.id] ?: 0,
                  onAddToCart = { onAddToCart(prod) },
                  onRemoveFromCart = { onRemoveFromCart(prod) },
                  onClick = { onProductClick(prod) }
                )
              }
            }
          }
        }
      }
    }
  }
}

// -----------------------------------------------------------------------------
// Popped Product Card Components
// -----------------------------------------------------------------------------
@Composable
fun PoppedProductCard(
  product: Product,
  isWishlisted: Boolean,
  onToggleWishlist: () -> Unit,
  qtyInCart: Int,
  onAddToCart: () -> Unit,
  onRemoveFromCart: () -> Unit,
  onClick: () -> Unit
) {
  Card(
    modifier = Modifier
      .fillMaxWidth()
      .shadow(elevation = 4.dp, shape = RoundedCornerShape(16.dp), spotColor = Color(0x11000000))
      .clickable { onClick() },
    shape = RoundedCornerShape(16.dp),
    colors = CardDefaults.cardColors(containerColor = CreamCardBg),
    border = BorderStroke(1.dp, CreamCardBorder)
  ) {
    Column(
      modifier = Modifier.padding(10.dp),
      verticalArrangement = Arrangement.spacedBy(6.dp)
    ) {
      Box(
        modifier = Modifier
          .fillMaxWidth()
          .aspectRatio(1.2f)
          .clip(RoundedCornerShape(12.dp))
          .background(CreamSurfaceVariant),
        contentAlignment = Alignment.Center
      ) {
        Text(text = product.emoji, fontSize = 42.sp)

        // Delivery Pill Tag
        Box(
          modifier = Modifier
            .align(Alignment.TopStart)
            .padding(6.dp)
        ) {
          PoppedBadge(text = "⚡ ${product.deliveryTime}", bgColor = BlinkitYellow, textColor = Color.Black)
        }

        // Wishlist Button
        IconButton(
          onClick = { onToggleWishlist() },
          modifier = Modifier
            .align(Alignment.TopEnd)
            .size(30.dp)
        ) {
          Icon(
            imageVector = if (isWishlisted) Icons.Filled.Favorite else Icons.Outlined.FavoriteBorder,
            contentDescription = "Wishlist",
            tint = if (isWishlisted) UrgentRed else Slate400,
            modifier = Modifier.size(18.dp)
          )
        }
      }

      Text(
        text = product.name,
        style = Typography.titleMedium,
        fontWeight = FontWeight.Bold,
        color = Slate900,
        maxLines = 1,
        overflow = TextOverflow.Ellipsis
      )

      Row(
        modifier = Modifier.fillMaxWidth(),
        horizontalArrangement = Arrangement.SpaceBetween,
        verticalAlignment = Alignment.CenterVertically
      ) {
        Column {
          Text(
            text = "₹${product.price.formatWithCommas()}",
            style = Typography.titleMedium,
            fontWeight = FontWeight.Black,
            color = BlinkitGreen
          )
          Text(
            text = "₹${product.originalPrice.formatWithCommas()}",
            style = Typography.bodySmall,
            color = Slate400,
            textDecoration = TextDecoration.LineThrough
          )
        }

        // Incrementor or ADD Button
        if (qtyInCart == 0) {
          Surface(
            color = BlinkitGreen,
            shape = RoundedCornerShape(8.dp),
            modifier = Modifier.clickable { onAddToCart() }
          ) {
            Text(
              text = "+ ADD",
              fontWeight = FontWeight.Black,
              fontSize = 12.sp,
              color = Color.White,
              modifier = Modifier.padding(horizontal = 12.dp, vertical = 6.dp)
            )
          }
        } else {
          Row(
            verticalAlignment = Alignment.CenterVertically,
            modifier = Modifier
              .background(BlinkitGreen, RoundedCornerShape(8.dp))
              .padding(horizontal = 4.dp, vertical = 4.dp)
          ) {
            Icon(
              imageVector = Icons.Filled.Remove,
              contentDescription = "Decrease",
              tint = Color.White,
              modifier = Modifier
                .size(16.dp)
                .clickable { onRemoveFromCart() }
            )
            Text(
              text = "$qtyInCart",
              fontWeight = FontWeight.Black,
              fontSize = 12.sp,
              color = Color.White,
              modifier = Modifier.padding(horizontal = 6.dp)
            )
            Icon(
              imageVector = Icons.Filled.Add,
              contentDescription = "Increase",
              tint = Color.White,
              modifier = Modifier
                .size(16.dp)
                .clickable { onAddToCart() }
            )
          }
        }
      }
    }
  }
}

@Composable
fun HorizontalPoppedProductCard(
  product: Product,
  qtyInCart: Int,
  onAddToCart: () -> Unit,
  onRemoveFromCart: () -> Unit,
  onClick: () -> Unit
) {
  Card(
    modifier = Modifier
      .fillMaxWidth()
      .clickable { onClick() },
    shape = RoundedCornerShape(14.dp),
    colors = CardDefaults.cardColors(containerColor = CreamCardBg),
    border = BorderStroke(1.dp, CreamCardBorder)
  ) {
    Row(
      modifier = Modifier.padding(10.dp),
      verticalAlignment = Alignment.CenterVertically,
      horizontalArrangement = Arrangement.spacedBy(10.dp)
    ) {
      Box(
        modifier = Modifier
          .size(60.dp)
          .clip(RoundedCornerShape(10.dp))
          .background(CreamSurfaceVariant),
        contentAlignment = Alignment.Center
      ) {
        Text(text = product.emoji, fontSize = 32.sp)
      }

      Column(modifier = Modifier.weight(1f)) {
        Text(
          text = product.name,
          style = Typography.titleMedium,
          fontWeight = FontWeight.Bold,
          color = Slate900,
          maxLines = 1,
          overflow = TextOverflow.Ellipsis
        )
        Row(horizontalArrangement = Arrangement.spacedBy(6.dp), verticalAlignment = Alignment.CenterVertically) {
          Text(
            text = "₹${product.price.formatWithCommas()}",
            style = Typography.titleSmall,
            fontWeight = FontWeight.Black,
            color = BlinkitGreen
          )
          val discountPct = ((product.originalPrice - product.price) * 100) / product.originalPrice
          Text(text = "$discountPct% OFF", color = BlinkitGreen, fontSize = 10.sp, fontWeight = FontWeight.Bold)
        }
        Text(text = "⚡ ${product.deliveryTime}", fontSize = 10.sp, color = Slate500)
      }

      if (qtyInCart == 0) {
        Surface(
          color = BlinkitGreen,
          shape = RoundedCornerShape(8.dp),
          modifier = Modifier.clickable { onAddToCart() }
        ) {
          Text(
            text = "+ ADD",
            fontWeight = FontWeight.Black,
            fontSize = 11.sp,
            color = Color.White,
            modifier = Modifier.padding(horizontal = 10.dp, vertical = 6.dp)
          )
        }
      } else {
        Row(
          verticalAlignment = Alignment.CenterVertically,
          modifier = Modifier
            .background(BlinkitGreen, RoundedCornerShape(8.dp))
            .padding(horizontal = 4.dp, vertical = 4.dp)
        ) {
          Icon(imageVector = Icons.Filled.Remove, contentDescription = null, tint = Color.White, modifier = Modifier.size(14.dp).clickable { onRemoveFromCart() })
          Text(text = "$qtyInCart", fontWeight = FontWeight.Black, fontSize = 12.sp, color = Color.White, modifier = Modifier.padding(horizontal = 4.dp))
          Icon(imageVector = Icons.Filled.Add, contentDescription = null, tint = Color.White, modifier = Modifier.size(14.dp).clickable { onAddToCart() })
        }
      }
    }
  }
}

// -----------------------------------------------------------------------------
// Blinkit Location Header & Search Components
// -----------------------------------------------------------------------------
@Composable
fun BlinkitLocationHeader(
  unreadNotifCount: Int,
  totalCartCount: Int,
  onNotificationClick: () -> Unit,
  onCartClick: () -> Unit
) {
  Surface(
    color = Color.Transparent,
    modifier = Modifier.fillMaxWidth()
  ) {
    Column(
      modifier = Modifier
        .fillMaxWidth()
        .statusBarsPadding()
        .padding(horizontal = 16.dp, vertical = 8.dp)
    ) {
      Row(
        modifier = Modifier.fillMaxWidth(),
        horizontalArrangement = Arrangement.SpaceBetween,
        verticalAlignment = Alignment.CenterVertically
      ) {
        Column {
          Row(verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.spacedBy(6.dp)) {
            Text(text = "ShopKart", color = Slate900, fontSize = 20.sp, fontWeight = FontWeight.Black)
            PoppedBadge(text = "PLUS ⚡", bgColor = BlinkitYellow, textColor = Color.Black)
          }
          Text(text = "Deliver to Praveen • Bengaluru 560103 ▾", color = Slate700, fontSize = 12.sp, fontWeight = FontWeight.SemiBold)
        }

        Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
          IconButton(
            onClick = { onNotificationClick() },
            modifier = Modifier
              .background(CreamSurfaceVariant, CircleShape)
              .border(1.dp, CreamCardBorder, CircleShape)
              .size(38.dp)
          ) {
            Icon(imageVector = Icons.Filled.Notifications, contentDescription = "Alerts", tint = Slate900, modifier = Modifier.size(18.dp))
          }

          IconButton(
            onClick = { onCartClick() },
            modifier = Modifier
              .background(BlinkitYellow, CircleShape)
              .size(38.dp)
          ) {
            Icon(imageVector = Icons.Filled.ShoppingCart, contentDescription = "Cart", tint = Color.Black, modifier = Modifier.size(18.dp))
          }
        }
      }
    }
  }
}

@Composable
fun BlinkitSearchBar(
  searchQuery: String,
  onSearchQueryChange: (String) -> Unit,
  selectedSort: String,
  onOpenSortModal: () -> Unit
) {
  Row(
    modifier = Modifier
      .fillMaxWidth()
      .padding(horizontal = 16.dp, vertical = 6.dp),
    verticalAlignment = Alignment.CenterVertically,
    horizontalArrangement = Arrangement.spacedBy(8.dp)
  ) {
    OutlinedTextField(
      value = searchQuery,
      onValueChange = onSearchQueryChange,
      modifier = Modifier
        .weight(1f)
        .height(50.dp),
      placeholder = { Text("Search 'iPhone', 'Sony Headphones'...", color = Slate400, fontSize = 13.sp) },
      leadingIcon = { Icon(imageVector = Icons.Filled.Search, contentDescription = null, tint = BlinkitGreen) },
      trailingIcon = {
        if (searchQuery.isNotEmpty()) {
          IconButton(onClick = { onSearchQueryChange("") }) {
            Icon(imageVector = Icons.Filled.Clear, contentDescription = "Clear", tint = Slate500)
          }
        }
      },
      singleLine = true,
      shape = RoundedCornerShape(14.dp),
      colors = OutlinedTextFieldDefaults.colors(
        focusedContainerColor = CreamCardBg,
        unfocusedContainerColor = CreamCardBg,
        focusedBorderColor = BlinkitGreen,
        unfocusedBorderColor = CreamCardBorder,
        focusedTextColor = Slate900,
        unfocusedTextColor = Slate900
      )
    )

    Surface(
      color = CreamCardBg,
      shape = RoundedCornerShape(14.dp),
      border = BorderStroke(1.dp, CreamCardBorder),
      modifier = Modifier
        .size(50.dp)
        .clickable { onOpenSortModal() }
    ) {
      Box(contentAlignment = Alignment.Center) {
        Icon(imageVector = Icons.Filled.Tune, contentDescription = "Sort", tint = BlinkitGreen, modifier = Modifier.size(20.dp))
      }
    }
  }
}

@Composable
fun QuickFilterChipsRow(
  selectedFilter: String,
  onFilterSelected: (String) -> Unit
) {
  LazyRow(
    contentPadding = PaddingValues(horizontal = 16.dp),
    horizontalArrangement = Arrangement.spacedBy(8.dp),
    modifier = Modifier.padding(vertical = 4.dp)
  ) {
    items(listOf("All", "⚡ 10-Min Delivery", "🔥 > 30% Off", "⭐ 4.8+ Rated", "Under ₹25,000", "In Stock")) { filter ->
      val isSelected = selectedFilter == filter
      Surface(
        color = if (isSelected) BlinkitGreen else CreamCardBg,
        shape = RoundedCornerShape(20.dp),
        border = BorderStroke(1.dp, if (isSelected) BlinkitGreen else CreamCardBorder),
        modifier = Modifier.clickable { onFilterSelected(filter) }
      ) {
        Text(
          text = filter,
          color = if (isSelected) Color.White else Slate800,
          fontSize = 11.sp,
          fontWeight = FontWeight.Bold,
          modifier = Modifier.padding(horizontal = 12.dp, vertical = 6.dp)
        )
      }
    }
  }
}

@Composable
fun BlinkitCategoriesRow(
  categories: List<CategoryItem>,
  selectedCategory: String,
  onCategorySelected: (String) -> Unit
) {
  LazyRow(
    contentPadding = PaddingValues(horizontal = 16.dp),
    horizontalArrangement = Arrangement.spacedBy(12.dp),
    modifier = Modifier.padding(vertical = 8.dp)
  ) {
    items(categories) { cat ->
      val isSelected = cat.id == selectedCategory
      Column(
        horizontalAlignment = Alignment.CenterHorizontally,
        modifier = Modifier.clickable { onCategorySelected(cat.id) }
      ) {
        Box(
          modifier = Modifier
            .size(56.dp)
            .clip(RoundedCornerShape(18.dp))
            .background(if (isSelected) cat.bgColor else CreamCardBg)
            .border(1.5.dp, if (isSelected) cat.textColor else CreamCardBorder, RoundedCornerShape(18.dp)),
          contentAlignment = Alignment.Center
        ) {
          Text(text = cat.iconEmoji, fontSize = 26.sp)
        }
        Text(
          text = cat.label,
          fontSize = 11.sp,
          fontWeight = if (isSelected) FontWeight.Black else FontWeight.Bold,
          color = if (isSelected) cat.textColor else Slate700,
          modifier = Modifier.padding(top = 4.dp)
        )
      }
    }
  }
}

@Composable
fun PoppedBadge(text: String, bgColor: Color, textColor: Color) {
  Surface(
    color = bgColor,
    shape = RoundedCornerShape(6.dp)
  ) {
    Text(
      text = text,
      color = textColor,
      fontSize = 9.sp,
      fontWeight = FontWeight.Black,
      modifier = Modifier.padding(horizontal = 6.dp, vertical = 2.dp)
    )
  }
}

// -----------------------------------------------------------------------------
// Auto-Scrolling Banner Carousel Component
// -----------------------------------------------------------------------------
@Composable
fun AutoScrollingBannerCarousel() {
  var currentPage by remember { mutableIntStateOf(0) }
  val banners = remember {
    listOf(
      Triple("⚡ SHOPKART FLASH SALE", "Get Tech Deals Delivered in 10 Mins!", BlinkitGreen),
      Triple("📱 IPHONE 15 PRO MAX", "Flat ₹25,000 Instant Discount Active", PrimaryBlue),
      Triple("🎉 FESTIVE MEGA SAVINGS", "Use Code FESTIVE20 for Extra 20% OFF", PurpleAccent)
    )
  }

  LaunchedEffect(Unit) {
    while (true) {
      delay(3500)
      currentPage = (currentPage + 1) % banners.size
    }
  }

  val activeBanner = banners[currentPage]

  Card(
    modifier = Modifier
      .fillMaxWidth()
      .height(110.dp)
      .shadow(4.dp, RoundedCornerShape(16.dp), spotColor = Color(0x11000000)),
    shape = RoundedCornerShape(16.dp),
    colors = CardDefaults.cardColors(containerColor = CreamCardBg),
    border = BorderStroke(1.5.dp, activeBanner.third)
  ) {
    Row(
      modifier = Modifier
        .fillMaxSize()
        .padding(16.dp),
      verticalAlignment = Alignment.CenterVertically,
      horizontalArrangement = Arrangement.SpaceBetween
    ) {
      Column(modifier = Modifier.weight(1f)) {
        PoppedBadge(text = activeBanner.first, bgColor = activeBanner.third, textColor = Color.White)
        Spacer(modifier = Modifier.height(6.dp))
        Text(
          text = activeBanner.second,
          style = Typography.titleMedium,
          fontWeight = FontWeight.Black,
          color = Slate900
        )
      }

      Surface(
        color = activeBanner.third,
        shape = CircleShape,
        modifier = Modifier.size(36.dp)
      ) {
        Box(contentAlignment = Alignment.Center) {
          Icon(imageVector = Icons.Filled.ElectricBolt, contentDescription = null, tint = Color.White)
        }
      }
    }
  }
}

// -----------------------------------------------------------------------------
// Flash Sale Ticker Section
// -----------------------------------------------------------------------------
@Composable
fun FlashSaleTickerSection(
  products: List<Product>,
  cartItems: Map<String, Int>,
  onProductClick: (Product) -> Unit,
  onAddToCart: (Product) -> Unit,
  onRemoveFromCart: (Product) -> Unit
) {
  var timeRemaining by remember { mutableStateOf("01h : 42m : 18s") }

  Column(
    modifier = Modifier
      .fillMaxWidth()
      .padding(vertical = 8.dp)
  ) {
    Row(
      modifier = Modifier
        .fillMaxWidth()
        .padding(horizontal = 16.dp),
      horizontalArrangement = Arrangement.SpaceBetween,
      verticalAlignment = Alignment.CenterVertically
    ) {
      Row(verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.spacedBy(6.dp)) {
        Icon(imageVector = Icons.Filled.FlashOn, contentDescription = null, tint = WarningOrange)
        Text(text = "FLASH SALE", style = Typography.titleMedium, fontWeight = FontWeight.Black, color = WarningOrange)
      }
      Surface(color = WarningOrangeBg, shape = RoundedCornerShape(8.dp), border = BorderStroke(1.dp, WarningOrange)) {
        Text(text = "Ends in $timeRemaining", fontSize = 11.sp, fontWeight = FontWeight.Bold, color = WarningOrange, modifier = Modifier.padding(horizontal = 8.dp, vertical = 4.dp))
      }
    }

    LazyRow(
      contentPadding = PaddingValues(horizontal = 16.dp, vertical = 8.dp),
      horizontalArrangement = Arrangement.spacedBy(12.dp)
    ) {
      items(products) { prod ->
        Box(modifier = Modifier.width(160.dp)) {
          PoppedProductCard(
            product = prod,
            isWishlisted = false,
            onToggleWishlist = {},
            qtyInCart = cartItems[prod.id] ?: 0,
            onAddToCart = { onAddToCart(prod) },
            onRemoveFromCart = { onRemoveFromCart(prod) },
            onClick = { onProductClick(prod) }
          )
        }
      }
    }
  }
}

// -----------------------------------------------------------------------------
// Activity Screen Content (Live Order Timeline)
// -----------------------------------------------------------------------------
@Composable
fun ActivityScreenContent() {
  LazyColumn(
    modifier = Modifier
      .fillMaxSize()
      .statusBarsPadding()
      .padding(horizontal = 16.dp),
    verticalArrangement = Arrangement.spacedBy(16.dp),
    contentPadding = PaddingValues(bottom = 24.dp)
  ) {
    item {
      Text(
        text = "Order Tracking & History",
        style = Typography.titleLarge,
        fontWeight = FontWeight.Black,
        color = Slate900,
        modifier = Modifier.padding(top = 8.dp)
      )
    }

    item {
      Card(
        modifier = Modifier.fillMaxWidth(),
        shape = RoundedCornerShape(16.dp),
        colors = CardDefaults.cardColors(containerColor = CreamCardBg),
        border = BorderStroke(1.5.dp, BlinkitGreen)
      ) {
        Column(modifier = Modifier.padding(16.dp), verticalArrangement = Arrangement.spacedBy(12.dp)) {
          Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically
          ) {
            PoppedBadge(text = "ODR-774120 • LIVE", bgColor = BlinkitYellow, textColor = Color.Black)
            Text(text = "Arriving in 8 mins 🛵", fontSize = 12.sp, fontWeight = FontWeight.Bold, color = BlinkitGreen)
          }

          Text(text = "Apple Watch Series 9 (45mm)", style = Typography.titleMedium, fontWeight = FontWeight.Bold, color = Slate900)

          LinearProgressIndicator(
            progress = { 0.75f },
            modifier = Modifier.fillMaxWidth().height(8.dp).clip(CircleShape),
            color = BlinkitGreen,
            trackColor = CreamSurfaceVariant,
          )

          Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween) {
            Text(text = "Packed", fontSize = 10.sp, color = BlinkitGreen, fontWeight = FontWeight.Bold)
            Text(text = "Out for Delivery", fontSize = 10.sp, color = BlinkitGreen, fontWeight = FontWeight.Bold)
            Text(text = "Delivered", fontSize = 10.sp, color = Slate400)
          }
        }
      }
    }
  }
}

// -----------------------------------------------------------------------------
// Flipkart-Style Profile & Account Screen Content
// -----------------------------------------------------------------------------
@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun ProfileScreenContent(
  onNavigateToOrders: () -> Unit,
  wishlistCount: Int,
  onShowSnackbar: (String) -> Unit
) {
  var showAddAddressModal by remember { mutableStateOf(false) }
  var addressesList = remember {
    mutableStateListOf(
      Triple("Home (Default)", "Praveen Kumar • +91 9811223344", "Flat 402, Royal Palms, Outer Ring Road, Bellandur, Bengaluru, Karnataka - 560103"),
      Triple("Work", "Praveen Kumar • +91 9811223344", "Tech Hub Tower B, 5th Floor, EPIP Zone, Whitefield, Bengaluru, Karnataka - 560066")
    )
  }

  // Address Modal Input State
  var newType by remember { mutableStateOf("Home") }
  var newStreet by remember { mutableStateOf("") }
  var newCity by remember { mutableStateOf("Bengaluru") }
  var newPincode by remember { mutableStateOf("560103") }

  LazyColumn(
    modifier = Modifier
      .fillMaxSize()
      .statusBarsPadding()
      .padding(horizontal = 16.dp),
    verticalArrangement = Arrangement.spacedBy(16.dp),
    contentPadding = PaddingValues(bottom = 32.dp, top = 8.dp)
  ) {
    // 1. Title Header
    item {
      Row(
        modifier = Modifier.fillMaxWidth(),
        horizontalArrangement = Arrangement.SpaceBetween,
        verticalAlignment = Alignment.CenterVertically
      ) {
        Column {
          Text(text = "Hey, Praveen! 👋", style = Typography.headlineMedium, fontWeight = FontWeight.Black, color = Slate900)
          Text(text = "Manage your orders, addresses & ShopKart Pass", style = Typography.bodySmall, color = Slate600)
        }
        PoppedBadge(text = "PLUS VIP", bgColor = BlinkitYellow, textColor = Color.Black)
      }
    }

    // 2. Profile User Card (Flipkart Account Header Style)
    item {
      Card(
        modifier = Modifier.fillMaxWidth(),
        shape = RoundedCornerShape(18.dp),
        colors = CardDefaults.cardColors(containerColor = CreamCardBg),
        border = BorderStroke(1.5.dp, PrimaryBlue)
      ) {
        Column(modifier = Modifier.padding(16.dp), verticalArrangement = Arrangement.spacedBy(12.dp)) {
          Row(
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.spacedBy(14.dp)
          ) {
            Box(
              modifier = Modifier
                .size(60.dp)
                .background(
                  Brush.linearGradient(listOf(PrimaryBlueContainer, Color(0xFFDBEAFE))),
                  CircleShape
                )
                .border(2.5.dp, PrimaryBlue, CircleShape),
              contentAlignment = Alignment.Center
            ) {
              Text(text = "PK", fontSize = 22.sp, fontWeight = FontWeight.Black, color = PrimaryBlueDark)
            }

            Column(modifier = Modifier.weight(1f)) {
              Row(verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.spacedBy(6.dp)) {
                Text(text = "Praveen Kumar", style = Typography.titleLarge, fontWeight = FontWeight.Black, color = Slate900)
                Surface(
                  color = BlinkitYellow,
                  shape = RoundedCornerShape(4.dp),
                  modifier = Modifier.padding(start = 2.dp)
                ) {
                  Text(
                    text = "PLUS",
                    fontSize = 10.sp,
                    fontWeight = FontWeight.Black,
                    color = Color.Black,
                    modifier = Modifier.padding(horizontal = 6.dp, vertical = 2.dp)
                  )
                }
              }

              Text(text = "customer1@shopkart.com • +91 9811223344", style = Typography.bodySmall, color = Slate600)
              
              Row(
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.spacedBy(4.dp),
                modifier = Modifier.padding(top = 4.dp)
              ) {
                Icon(imageVector = Icons.Filled.Star, contentDescription = null, tint = GoldStar, modifier = Modifier.size(14.dp))
                Text(text = "ShopKart VIP Member • 10-Min Free Express Delivery", fontSize = 11.sp, fontWeight = FontWeight.Bold, color = GoldStar)
              }
            }

            Surface(
              color = CreamSurfaceVariant,
              shape = CircleShape,
              border = BorderStroke(1.dp, CreamCardBorder),
              modifier = Modifier
                .size(36.dp)
                .clickable { onShowSnackbar("Profile details up to date!") }
            ) {
              Box(contentAlignment = Alignment.Center) {
                Icon(imageVector = Icons.Filled.Verified, contentDescription = "Verified", tint = PrimaryBlue, modifier = Modifier.size(20.dp))
              }
            }
          }

          HorizontalDivider(color = CreamCardBorder)

          // Flipkart Quick Balance Bar (SuperCoins & Pay Later)
          Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.SpaceBetween
          ) {
            Row(
              verticalAlignment = Alignment.CenterVertically,
              horizontalArrangement = Arrangement.spacedBy(6.dp),
              modifier = Modifier.clickable { onShowSnackbar("480 ShopKart SuperCoins available!") }
            ) {
              Surface(color = Color(0xFFFEF3C7), shape = CircleShape, modifier = Modifier.size(24.dp)) {
                Box(contentAlignment = Alignment.Center) {
                  Text(text = "🪙", fontSize = 12.sp)
                }
              }
              Column {
                Text(text = "480 SuperCoins", style = Typography.titleSmall, fontWeight = FontWeight.Black, color = Slate900)
                Text(text = "Use on next order", fontSize = 10.sp, color = Slate600)
              }
            }

            Box(modifier = Modifier.width(1.dp).height(30.dp).background(CreamCardBorder))

            Row(
              verticalAlignment = Alignment.CenterVertically,
              horizontalArrangement = Arrangement.spacedBy(6.dp),
              modifier = Modifier.clickable { onShowSnackbar("₹2,500 Pay Later limit ready") }
            ) {
              Surface(color = Color(0xFFDCFCE7), shape = CircleShape, modifier = Modifier.size(24.dp)) {
                Box(contentAlignment = Alignment.Center) {
                  Text(text = "⚡", fontSize = 12.sp)
                }
              }
              Column {
                Text(text = "₹2,500 Pay Later", style = Typography.titleSmall, fontWeight = FontWeight.Black, color = Slate900)
                Text(text = "0% Interest • 30 Days", fontSize = 10.sp, color = Slate600)
              }
            }
          }
        }
      }
    }

    // 3. Flipkart 4-Shortcut Grid (My Orders, Wishlist, Coupons, Pay Later)
    item {
      Row(
        modifier = Modifier.fillMaxWidth(),
        horizontalArrangement = Arrangement.spacedBy(10.dp)
      ) {
        // Orders Tile
        Card(
          modifier = Modifier
            .weight(1f)
            .clickable { onNavigateToOrders() },
          shape = RoundedCornerShape(14.dp),
          colors = CardDefaults.cardColors(containerColor = CreamCardBg),
          border = BorderStroke(1.dp, CreamCardBorder)
        ) {
          Column(modifier = Modifier.padding(12.dp), verticalArrangement = Arrangement.spacedBy(4.dp)) {
            Icon(imageVector = Icons.Filled.ShoppingCart, contentDescription = null, tint = PrimaryBlue, modifier = Modifier.size(22.dp))
            Text(text = "Orders", style = Typography.titleSmall, fontWeight = FontWeight.Black, color = Slate900)
            Text(text = "Track & Return", fontSize = 10.sp, color = Slate600)
          }
        }

        // Wishlist Tile
        Card(
          modifier = Modifier
            .weight(1f)
            .clickable { onShowSnackbar("Wishlist contains $wishlistCount saved items") },
          shape = RoundedCornerShape(14.dp),
          colors = CardDefaults.cardColors(containerColor = CreamCardBg),
          border = BorderStroke(1.dp, CreamCardBorder)
        ) {
          Column(modifier = Modifier.padding(12.dp), verticalArrangement = Arrangement.spacedBy(4.dp)) {
            Icon(imageVector = Icons.Filled.Favorite, contentDescription = null, tint = UrgentRed, modifier = Modifier.size(22.dp))
            Text(text = "Wishlist", style = Typography.titleSmall, fontWeight = FontWeight.Black, color = Slate900)
            Text(text = "$wishlistCount Items Saved", fontSize = 10.sp, color = Slate600)
          }
        }

        // Coupons Tile
        Card(
          modifier = Modifier
            .weight(1f)
            .clickable { onShowSnackbar("Code FESTIVE20 active for 20% OFF") },
          shape = RoundedCornerShape(14.dp),
          colors = CardDefaults.cardColors(containerColor = CreamCardBg),
          border = BorderStroke(1.dp, CreamCardBorder)
        ) {
          Column(modifier = Modifier.padding(12.dp), verticalArrangement = Arrangement.spacedBy(4.dp)) {
            Icon(imageVector = Icons.Filled.Discount, contentDescription = null, tint = BlinkitGreen, modifier = Modifier.size(22.dp))
            Text(text = "Coupons", style = Typography.titleSmall, fontWeight = FontWeight.Black, color = Slate900)
            Text(text = "20% OFF Ready", fontSize = 10.sp, color = Slate600)
          }
        }

        // Pay Later Tile
        Card(
          modifier = Modifier
            .weight(1f)
            .clickable { onShowSnackbar("ShopKart Pay Later Balance: ₹2,500 Available") },
          shape = RoundedCornerShape(14.dp),
          colors = CardDefaults.cardColors(containerColor = CreamCardBg),
          border = BorderStroke(1.dp, CreamCardBorder)
        ) {
          Column(modifier = Modifier.padding(12.dp), verticalArrangement = Arrangement.spacedBy(4.dp)) {
            Icon(imageVector = Icons.Filled.ElectricBolt, contentDescription = null, tint = GoldStar, modifier = Modifier.size(22.dp))
            Text(text = "Pay Later", style = Typography.titleSmall, fontWeight = FontWeight.Black, color = Slate900)
            Text(text = "₹2,500 Limit", fontSize = 10.sp, color = Slate600)
          }
        }
      }
    }

    // 4. Live Active Order Tracking Banner (Flipkart Live Order Card)
    item {
      Card(
        modifier = Modifier
          .fillMaxWidth()
          .clickable { onNavigateToOrders() },
        shape = RoundedCornerShape(16.dp),
        colors = CardDefaults.cardColors(containerColor = CreamCardBg),
        border = BorderStroke(1.5.dp, BlinkitGreen)
      ) {
        Column(modifier = Modifier.padding(14.dp), verticalArrangement = Arrangement.spacedBy(10.dp)) {
          Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically
          ) {
            Row(verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.spacedBy(6.dp)) {
              Icon(imageVector = Icons.Filled.LocalShipping, contentDescription = null, tint = BlinkitGreen, modifier = Modifier.size(18.dp))
              Text(text = "Active Order • ODR-774120", style = Typography.titleSmall, fontWeight = FontWeight.Black, color = Slate900)
            }
            PoppedBadge(text = "In 8 Mins 🛵", bgColor = SuccessGreenBg, textColor = BlinkitGreen)
          }

          Text(text = "Apple Watch Series 9 (45mm Starlight)", style = Typography.bodyMedium, fontWeight = FontWeight.Bold, color = Slate900)

          LinearProgressIndicator(
            progress = { 0.75f },
            modifier = Modifier
              .fillMaxWidth()
              .height(6.dp)
              .clip(CircleShape),
            color = BlinkitGreen,
            trackColor = CreamSurfaceVariant
          )

          Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically
          ) {
            Text(text = "Out for delivery from Bengaluru Dark Store", fontSize = 11.sp, color = Slate600)
            Text(
              text = "Track Live ➔",
              fontSize = 12.sp,
              fontWeight = FontWeight.Black,
              color = BlinkitGreen
            )
          }
        }
      }
    }

    // 5. Saved Addresses Section (Flipkart Style)
    item {
      Column(verticalArrangement = Arrangement.spacedBy(10.dp)) {
        Row(
          modifier = Modifier.fillMaxWidth(),
          horizontalArrangement = Arrangement.SpaceBetween,
          verticalAlignment = Alignment.CenterVertically
        ) {
          Row(verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.spacedBy(6.dp)) {
            Icon(imageVector = Icons.Filled.LocationOn, contentDescription = null, tint = PrimaryBlue, modifier = Modifier.size(20.dp))
            Text(text = "Saved Delivery Addresses", style = Typography.titleMedium, fontWeight = FontWeight.Black, color = Slate900)
          }

          Text(
            text = "+ Add New",
            fontSize = 12.sp,
            fontWeight = FontWeight.Black,
            color = PrimaryBlue,
            modifier = Modifier.clickable { showAddAddressModal = true }
          )
        }

        addressesList.forEachIndexed { index, addr ->
          Card(
            modifier = Modifier.fillMaxWidth(),
            shape = RoundedCornerShape(14.dp),
            colors = CardDefaults.cardColors(containerColor = CreamCardBg),
            border = BorderStroke(1.dp, if (index == 0) PrimaryBlue else CreamCardBorder)
          ) {
            Column(modifier = Modifier.padding(14.dp), verticalArrangement = Arrangement.spacedBy(4.dp)) {
              Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
              ) {
                Row(verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.spacedBy(6.dp)) {
                  Text(text = addr.first, style = Typography.titleSmall, fontWeight = FontWeight.Black, color = Slate900)
                  if (index == 0) {
                    PoppedBadge(text = "DEFAULT", bgColor = PrimaryBlueContainer, textColor = PrimaryBlueDark)
                  }
                }
                Icon(imageVector = Icons.Filled.CheckCircle, contentDescription = null, tint = if (index == 0) PrimaryBlue else Slate400, modifier = Modifier.size(18.dp))
              }
              Text(text = addr.second, style = Typography.bodySmall, fontWeight = FontWeight.Bold, color = Slate700)
              Text(text = addr.third, style = Typography.bodySmall, color = Slate600, lineHeight = 16.sp)
            }
          }
        }
      }
    }

    // 6. Past Orders History Summary (Flipkart Style)
    item {
      Column(verticalArrangement = Arrangement.spacedBy(10.dp)) {
        Text(text = "Past Orders History", style = Typography.titleMedium, fontWeight = FontWeight.Black, color = Slate900)

        listOf(
          Triple("SHOPKART-882194", "Sony WH-1000XM5 Headphones • ₹24,990", "Delivered Yesterday • Mumbai Hub WH-01"),
          Triple("SHOPKART-419082", "Nike Air Jordan 1 Retro High • ₹16,995", "Delivered Aug 12 • Delhi Hub WH-02")
        ).forEach { past ->
          Card(
            modifier = Modifier.fillMaxWidth(),
            shape = RoundedCornerShape(14.dp),
            colors = CardDefaults.cardColors(containerColor = CreamCardBg),
            border = BorderStroke(1.dp, CreamCardBorder)
          ) {
            Row(
              modifier = Modifier
                .fillMaxWidth()
                .padding(12.dp),
              horizontalArrangement = Arrangement.SpaceBetween,
              verticalAlignment = Alignment.CenterVertically
            ) {
              Column(modifier = Modifier.weight(1f)) {
                Text(text = past.first, fontSize = 11.sp, fontWeight = FontWeight.Bold, color = Slate500)
                Text(text = past.second, style = Typography.titleSmall, fontWeight = FontWeight.Bold, color = Slate900)
                Text(text = past.third, fontSize = 11.sp, color = BlinkitGreen, fontWeight = FontWeight.SemiBold)
              }

              Surface(
                color = BlinkitGreenLight,
                shape = RoundedCornerShape(8.dp),
                border = BorderStroke(1.dp, BlinkitGreen),
                modifier = Modifier.clickable { onShowSnackbar("Reordered ${past.first}!") }
              ) {
                Text(
                  text = "Reorder",
                  fontSize = 11.sp,
                  fontWeight = FontWeight.Black,
                  color = BlinkitGreen,
                  modifier = Modifier.padding(horizontal = 10.dp, vertical = 6.dp)
                )
              }
            }
          }
        }
      }
    }

    // 7. Account Settings & Support Group (Flipkart Menu List)
    item {
      Card(
        modifier = Modifier.fillMaxWidth(),
        shape = RoundedCornerShape(16.dp),
        colors = CardDefaults.cardColors(containerColor = CreamCardBg),
        border = BorderStroke(1.dp, CreamCardBorder)
      ) {
        Column(modifier = Modifier.padding(8.dp)) {
          listOf(
            Triple("24x7 Customer Support", "Instant chat for refunds & delivery queries", Icons.Filled.Verified),
            Triple("Saved Cards & Wallet", "Manage UPI handles & debit/credit cards", Icons.Filled.Discount),
            Triple("Notification Settings", "Order status SMS & Whatsapp alerts", Icons.Filled.Notifications),
            Triple("Select App Language", "English (India) • Hindi • Kannada", Icons.Filled.LocationOn)
          ).forEach { menu ->
            Row(
              modifier = Modifier
                .fillMaxWidth()
                .clickable { onShowSnackbar("${menu.first} opened") }
                .padding(horizontal = 12.dp, vertical = 12.dp),
              verticalAlignment = Alignment.CenterVertically,
              horizontalArrangement = Arrangement.spacedBy(12.dp)
            ) {
              Icon(imageVector = menu.third, contentDescription = null, tint = PrimaryBlue, modifier = Modifier.size(20.dp))
              Column(modifier = Modifier.weight(1f)) {
                Text(text = menu.first, style = Typography.titleSmall, fontWeight = FontWeight.Bold, color = Slate900)
                Text(text = menu.second, fontSize = 11.sp, color = Slate600)
              }
              Text(text = "›", fontSize = 20.sp, color = Slate400, fontWeight = FontWeight.Bold)
            }
            HorizontalDivider(color = CreamCardBorder, modifier = Modifier.padding(horizontal = 12.dp))
          }
        }
      }
    }

    // 8. Logout Button
    item {
      Button(
        onClick = { onShowSnackbar("Logged out successfully!") },
        modifier = Modifier
          .fillMaxWidth()
          .height(48.dp),
        colors = ButtonDefaults.buttonColors(containerColor = UrgentRedBg, contentColor = UrgentRed),
        shape = RoundedCornerShape(12.dp),
        border = BorderStroke(1.dp, UrgentRedBorder)
      ) {
        Text(text = "Log Out from ShopKart", fontWeight = FontWeight.Black)
      }
    }
  }

  // Add Address Modal Sheet
  if (showAddAddressModal) {
    ModalBottomSheet(
      onDismissRequest = { showAddAddressModal = false },
      containerColor = SurfaceWhite,
      shape = RoundedCornerShape(topStart = 24.dp, topEnd = 24.dp)
    ) {
      Column(
        modifier = Modifier
          .fillMaxWidth()
          .padding(20.dp)
          .navigationBarsPadding(),
        verticalArrangement = Arrangement.spacedBy(12.dp)
      ) {
        Row(
          modifier = Modifier.fillMaxWidth(),
          horizontalArrangement = Arrangement.SpaceBetween,
          verticalAlignment = Alignment.CenterVertically
        ) {
          Text(text = "+ Add Delivery Address", style = Typography.titleLarge, fontWeight = FontWeight.Black, color = Slate900)
          IconButton(onClick = { showAddAddressModal = false }) {
            Icon(imageVector = Icons.Filled.Close, contentDescription = "Close", tint = Slate500)
          }
        }

        OutlinedTextField(
          value = newType,
          onValueChange = { newType = it },
          label = { Text("Address Label (Home / Work / Other)") },
          modifier = Modifier.fillMaxWidth(),
          singleLine = true,
          colors = OutlinedTextFieldDefaults.colors(focusedBorderColor = PrimaryBlue)
        )

        OutlinedTextField(
          value = newStreet,
          onValueChange = { newStreet = it },
          label = { Text("Flat / House No. / Building / Street") },
          modifier = Modifier.fillMaxWidth(),
          colors = OutlinedTextFieldDefaults.colors(focusedBorderColor = PrimaryBlue)
        )

        Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
          OutlinedTextField(
            value = newCity,
            onValueChange = { newCity = it },
            label = { Text("City") },
            modifier = Modifier.weight(1f),
            singleLine = true
          )
          OutlinedTextField(
            value = newPincode,
            onValueChange = { newPincode = it },
            label = { Text("Pincode") },
            modifier = Modifier.weight(1f),
            singleLine = true
          )
        }

        Button(
          onClick = {
            if (newStreet.isNotBlank()) {
              addressesList.add(Triple(newType, "Praveen Kumar • +91 9811223344", "$newStreet, $newCity - $newPincode"))
              showAddAddressModal = false
              onShowSnackbar("New delivery address saved!")
            }
          },
          modifier = Modifier
            .fillMaxWidth()
            .height(48.dp),
          colors = ButtonDefaults.buttonColors(containerColor = PrimaryBlue, contentColor = Color.White),
          shape = RoundedCornerShape(12.dp)
        ) {
          Text("Save Address & Set as Default", fontWeight = FontWeight.Black)
        }
      }
    }
  }
}

