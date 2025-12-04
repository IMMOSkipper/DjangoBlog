$(document).ready(function() {
    // 搜索框元素
    var searchInput = $('#q');
    var searchSuggestions = $('#search-suggestions');
    var searchForm = $('#searchform');
    
    // 搜索历史键名
    var SEARCH_HISTORY_KEY = 'search_history';
    var MAX_HISTORY_LENGTH = 10;
    
    // 模拟搜索建议数据（实际应用中可以从服务器获取）
    var searchSuggestionsData = [
        'Django博客搭建',
        'Python教程',
        'Web开发',
        '前端优化',
        '数据库设计',
        '性能优化',
        '安全防护',
        'SEO优化',
        '响应式设计',
        'RESTful API'
    ];
    
    // 初始化搜索历史
    var searchHistory = JSON.parse(localStorage.getItem(SEARCH_HISTORY_KEY)) || [];
    
    // 显示搜索建议和历史
    function showSearchSuggestions(query) {
        var suggestions = [];
        
        // 根据输入过滤搜索建议
        if (query.length > 0) {
            suggestions = searchSuggestionsData.filter(function(item) {
                return item.toLowerCase().indexOf(query.toLowerCase()) > -1;
            });
        }
        
        // 构建搜索建议HTML
        var html = '';
        
        // 添加搜索建议
        if (suggestions.length > 0) {
            html += '<div class="history-title">搜索建议</div>';
            suggestions.forEach(function(item) {
                html += '<div class="suggestion-item" data-value="' + item + '">' + item + '</div>';
            });
        }
        
        // 添加搜索历史
        if (searchHistory.length > 0) {
            html += '<div class="history-title">搜索历史</div>';
            searchHistory.forEach(function(item) {
                html += '<div class="suggestion-item" data-value="' + item + '">' + item + '</div>';
            });
            
            // 添加清除历史按钮
            html += '<div class="clear-history">清除搜索历史</div>';
        }
        
        // 显示搜索建议
        if (html.length > 0) {
            searchSuggestions.html(html).show();
        } else {
            searchSuggestions.hide();
        }
    }
    
    // 隐藏搜索建议
    function hideSearchSuggestions() {
        searchSuggestions.hide();
    }
    
    // 添加搜索历史
    function addSearchHistory(query) {
        // 移除重复项
        searchHistory = searchHistory.filter(function(item) {
            return item !== query;
        });
        
        // 添加到历史记录开头
        searchHistory.unshift(query);
        
        // 限制历史记录长度
        if (searchHistory.length > MAX_HISTORY_LENGTH) {
            searchHistory = searchHistory.slice(0, MAX_HISTORY_LENGTH);
        }
        
        // 保存到localStorage
        localStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(searchHistory));
    }
    
    // 清除搜索历史
    function clearSearchHistory() {
        searchHistory = [];
        localStorage.removeItem(SEARCH_HISTORY_KEY);
        hideSearchSuggestions();
    }
    
    // 搜索框输入事件
    searchInput.on('input', function() {
        var query = $(this).val();
        showSearchSuggestions(query);
    });
    
    // 搜索框焦点事件
    searchInput.on('focus', function() {
        var query = $(this).val();
        showSearchSuggestions(query);
    });
    
    // 点击搜索建议项
    searchSuggestions.on('click', '.suggestion-item', function() {
        var value = $(this).data('value');
        searchInput.val(value);
        searchForm.submit();
    });
    
    // 清除搜索历史
    searchSuggestions.on('click', '.clear-history', function() {
        clearSearchHistory();
    });
    
    // 点击页面其他地方隐藏搜索建议
    $(document).on('click', function(event) {
        if (!$(event.target).closest('.search-container').length) {
            hideSearchSuggestions();
        }
    });
    
    // 搜索表单提交事件
    searchForm.on('submit', function() {
        var query = searchInput.val().trim();
        if (query.length > 0) {
            addSearchHistory(query);
        }
    });
    
    // 初始化时如果搜索框有值，显示搜索建议
    var initialQuery = searchInput.val().trim();
    if (initialQuery.length > 0) {
        showSearchSuggestions(initialQuery);
    }
});