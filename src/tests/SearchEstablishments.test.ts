/**
 * Manual Test Guide - Search Establishments Feature
 *
 * This document outlines the manual testing procedures for the Search Establishments feature.
 */

// ===== TEST SCENARIO 1: Basic Search =====
// 1. Open app and navigate to Home tab
// 2. Tap on search box in purple header ("Buscar bancos, clínicas, restaurantes...")
// 3. You should navigate to SearchEstablishments screen
// Expected: Search input field visible with empty results or default list
// Status: ✅ Should work

// ===== TEST SCENARIO 2: Search by Text =====
// 1. On SearchEstablishments screen
// 2. Type "Bank" in search field
// 3. Tap search icon or press "return" key
// Expected:
//   - List filters to show only establishments with "Bank" in name
//   - Shows count of results
// Status: ✅ Should work

// ===== TEST SCENARIO 3: Filter by Category =====
// 1. On SearchEstablishments screen
// 2. Tap filter icon (⚙️)
// 3. Select category "Restaurant"
// Expected:
//   - Dropdown closes
//   - List updates to show only restaurants
//   - Works with or without search text
// Status: ✅ Should work

// ===== TEST SCENARIO 4: Combine Search + Filter =====
// 1. Type "Central" in search
// 2. Select "Bank" category filter
// Expected:
//   - Shows only banks with "Central" in name
//   - Both filters apply together
// Status: ✅ Should work

// ===== TEST SCENARIO 5: Navigate to Establishment Details =====
// 1. Find any establishment card
// 2. Tap on the establishment card (anywhere except buttons)
// Expected:
//   - Navigate to EstablishmentDetailsScreen
//   - Display establishment details (name, address, queue info)
// Status: ✅ Should work

// ===== TEST SCENARIO 6: Enter Queue (Not Already In) =====
// Precondition: User NOT in queue at this establishment
// 1. Find establishment with "Entrar na Fila" button (green)
// 2. Tap "Entrar na Fila" button
// Expected:
//   - Navigate to CreateQueueScreen
//   - Show establishment details and party size selector
// Status: ✅ Should work

// ===== TEST SCENARIO 7: Give Up Queue (Already In) =====
// Precondition: User IS in queue at this establishment
// 1. Find establishment with "Desistir" button (red)
// 2. Tap "Desistir" button
// 3. Tap "Desistir" button in confirmation alert
// Expected:
//   - Show confirmation alert: "Tem certeza que deseja sair da fila?"
//   - If confirmed: Remove from queue and update UI
//   - Button changes back to "Entrar na Fila"
// Status: ✅ Should work

// ===== TEST SCENARIO 8: Queue Not Accepting =====
// Precondition: Establishment not accepting customers
// 1. Find establishment with message "A fila não está aceitando mais tickets"
// Expected:
//   - No action button shown
//   - Only message displayed
//   - Can still tap card to view details
// Status: ✅ Should work

// ===== TEST SCENARIO 9: No Results =====
// 1. Search for something that doesn't exist (e.g., "XYZABC123")
// Expected:
//   - Shows "Nenhum resultado encontrado"
//   - Shows "Tente mudar os filtros e buscar novamente"
//   - No cards displayed
// Status: ✅ Should work

// ===== TEST SCENARIO 10: Loading State =====
// 1. Open SearchEstablishments while on slow connection
// Expected:
//   - Show loading spinner
//   - Show "Carregando..." text
//   - Lock interactions while loading
// Status: ✅ Should work

// ===== TEST SCENARIO 11: Results Count =====
// 1. Perform any search
// Expected:
//   - Shows "X resultados" above the list (where X = count)
// Status: ✅ Should work

// ===== TEST SCENARIO 12: Category Dropdown Toggle =====
// 1. Tap filter icon
// 2. See dropdown with all categories
// 3. Tap filter icon again
// Expected:
//   - Dropdown toggles open/closed
//   - Current selection highlighted
// Status: ✅ Should work

// ===== TEST SCENARIO 13: All Categories Filter =====
// 1. Select "Todos" category
// Expected:
//   - Shows all establishments regardless of category
//   - No category-based filtering applied
// Status: ✅ Should work

// ===== TEST SCENARIO 14: Active Queue Badge =====
// Precondition: User has an active queue at an establishment
// 1. Open SearchEstablishments
// 2. Find the establishment where user has active queue
// Expected:
//   - Shows yellow badge "Na Fila"
//   - Shows "Desistir" button instead of "Entrar na Fila"
//   - Badge color is #FFC769 (yellow)
// Status: ✅ Should work

// ===== TEST SCENARIO 15: Header Integration =====
// 1. On SearchEstablishments screen
// 2. Tap profile icon (👤) in header
// Expected:
//   - Shows profile menu
//   - Options: Meu Perfil, Minhas Filas, Sair
// Status: ✅ Should work

// ===== TEST SCENARIO 16: Back Navigation =====
// 1. On SearchEstablishments
// 2. Tap back button (if available) or use OS back
// Expected:
//   - Navigate back to HomeScreen
//   - State is not preserved (fresh load on return)
// Status: ✅ Should work (React Navigation default)

// ===== TEST SCENARIO 17: Already In Queue Alert =====
// Precondition: User already in queue at an establishment
// 1. Tap "Entrar na Fila" button for that establishment
// Expected:
//   - Alert appears: "Já na Fila"
//   - Message: "Você já está na fila deste estabelecimento"
//   - Options: Cancel, Ver Fila
//   - If "Ver Fila": Navigate to MyQueuesScreen
// Status: ✅ Should work

// ===== TEST SCENARIO 18: Wait Time Display =====
// 1. Look at any establishment card
// Expected:
//   - Shows "15 minutes" (or actual wait time)
//   - Shows "Tempo de espera médio" label
//   - Format: "⏱️ 15 min"
// Status: ✅ Should work

// ===== TEST SCENARIO 19: Category Display on Card =====
// Precondition: User NOT in queue
// 1. Find any establishment
// Expected:
//   - Shows category tag (e.g., "Restaurante", "Banco", "Clínica")
//   - Tag is below wait time
// Status: ✅ Should work

// ===== TEST SCENARIO 20: Location Display =====
// 1. Look at any establishment card
// Expected:
//   - Shows "📍 [City]" (e.g., "📍 São Paulo")
//   - Below establishment name
// Status: ✅ Should work

/**
 * API ENDPOINTS BEING CALLED
 *
 * GET /api/establishments
 *   - Filters: category, search, page, pageSize
 *   - Returns: Array<Establishment>
 *
 * GET /api/queues/my
 *   - Returns: { activeQueues: Queue[], historyQueues: Queue[] }
 *
 * PUT /api/queues/{queueId}/cancel
 *   - Cancels/leaves a queue
 */

/**
 * TRANSLATIONS USED
 *
 * - common.loading
 * - common.noResults
 * - common.tryChangingFilters
 * - common.results
 * - establishment.averageWaitingTime
 * - establishment.giveUp
 * - establishment.getIn
 * - establishment.inQueue
 * - establishment.leaveQueueTitle
 * - establishment.leaveQueueMessage
 * - establishment.leaveSuccess
 * - establishment.leaveSuccessMessage
 * - establishment.alreadyInQueue
 * - establishment.alreadyInQueueMessage
 * - establishment.queueNotAccepting
 * - queues.cancel
 * - queues.viewQueue
 */

/**
 * KNOWN LIMITATIONS / FUTURE IMPROVEMENTS
 *
 * 1. No pagination on infinite scroll
 *    - Currently loads all results at once
 *    - Should implement pagination for large datasets
 *
 * 2. No sorting options
 *    - Could add: sort by wait time, distance, popularity
 *
 * 3. No favorites toggle from search screen
 *    - User must go to details to favorite
 *
 * 4. No geolocation filtering
 *    - Could show distance and sort by proximity
 *
 * 5. No recent searches cache
 *    - Could improve UX with history
 */

