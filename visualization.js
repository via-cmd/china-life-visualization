// 加载数据并创建可视化
fetch('data_processed.json')
    .then(response => response.json())
    .then(data => {
        createVisualizations(data);
    })
    .catch(error => {
        console.error('数据加载失败:', error);
    });

function createVisualizations(data) {
    // 图表1：城乡收入对比（组合图表）
    createIncomeComparisonChart(data);
    createMedianComparisonChart(data);  
    
    // 图表2：城镇收入结构（南丁格尔玫瑰图）
    createUrbanIncomeStructure(data);
    
    // 图表3：农村收入结构（南丁格尔玫瑰图）
    createRuralIncomeStructure(data);
    createIncomeTrendChart(data);  
    
    // 图表4：收入分配五等份组（瀑布图）
    createIncome5GroupChart(data);
    createGiniCoefficientChart(data);
    
    // 图表5：恩格尔系数变化（面积图）
    createEngelCoefficientChart(data);
    
    // 图表6：食品消费对比（雷达图）
    createFoodConsumptionChart(data);
    createFoodTrendChart(data);  
    
    // 图表7：耐用品拥有量（象形柱状图）
    createDurableGoodsChart(data);
    
    // 新闻情感分析图表
    createSentimentTrendChart();
    createTopicSentimentChart();
    createAchievementChallengeChart();
    createKeywordTimelineChart();
}

// 图表1：城乡收入对比（折线+柱状+双轴组合图）
function createIncomeComparisonChart(data) {
    const chart = echarts.init(document.getElementById('chart1'));
    
    const nationalData = data['全国居民人均收入情况'].data;
    const urbanData = data['城镇居民人均收入情况'].data;
    const ruralData = data['农村居民人均收入情况'].data;
    
    const years = ['2015年', '2016年', '2017年', '2018年', '2019年', '2020年', '2021年', '2022年', '2023年', '2024年'];
    
    // 提取数据
    let urbanIncome = [], ruralIncome = [], urbanGrowth = [], ruralGrowth = [];
    
    urbanData.forEach(item => {
        if (item['指标'] === '城镇居民人均可支配收入(元)') {
            urbanIncome = years.map(year => item[year]);
        }
        if (item['指标'] === '城镇居民人均可支配收入比上年增长(%)') {
            urbanGrowth = years.map(year => item[year]);
        }
    });
    
    ruralData.forEach(item => {
        if (item['指标'] === '农村居民人均可支配收入(元)') {
            ruralIncome = years.map(year => item[year]);
        }
        if (item['指标'] === '农村居民人均可支配收入比上年增长(%)') {
            ruralGrowth = years.map(year => item[year]);
        }
    });
    
    // 计算城乡差距
    const incomeDiff = urbanIncome.map((val, idx) => val - ruralIncome[idx]);
    
    const option = {
        title: {
            text: '城乡居民人均可支配收入对比（2015-2024）',
            subtext: '含城乡差距与增长率（可点击图例筛选）',
            left: 'center',
            textStyle: { fontSize: 18, fontWeight: 'bold' }
        },
        tooltip: {
            trigger: 'axis',
            axisPointer: { type: 'cross' }
        },
        legend: {
            data: ['城镇收入', '农村收入', '城乡差距', '城镇增长率', '农村增长率'],
            top: 50,
            selected: {
                '城镇增长率': false,
                '农村增长率': false
            }
        },
        grid: {
            left: '3%',
            right: '8%',
            bottom: '15%',
            containLabel: true
        },
        toolbox: {
            feature: {
                dataZoom: { yAxisIndex: 'none' },
                restore: {},
                saveAsImage: {}
            }
        },
        xAxis: {
            type: 'category',
            data: years,
            axisLabel: { rotate: 30 }
        },
        yAxis: [
            {
                type: 'value',
                name: '收入（元）',
                position: 'left',
                axisLabel: { formatter: '{value}' }
            },
            {
                type: 'value',
                name: '增长率（%）',
                position: 'right',
                axisLabel: { formatter: '{value}%' }
            }
        ],
        dataZoom: [
            { type: 'slider', start: 0, end: 100, bottom: 5 }
        ],
        series: [
            {
                name: '城镇收入',
                type: 'line',
                data: urbanIncome,
                smooth: true,
                lineStyle: { width: 3, color: '#5470c6' },
                itemStyle: { color: '#5470c6' },
                areaStyle: {
                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                        { offset: 0, color: 'rgba(84, 112, 198, 0.3)' },
                        { offset: 1, color: 'rgba(84, 112, 198, 0.05)' }
                    ])
                }
            },
            {
                name: '农村收入',
                type: 'line',
                data: ruralIncome,
                smooth: true,
                lineStyle: { width: 3, color: '#91cc75' },
                itemStyle: { color: '#91cc75' },
                areaStyle: {
                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                        { offset: 0, color: 'rgba(145, 204, 117, 0.3)' },
                        { offset: 1, color: 'rgba(145, 204, 117, 0.05)' }
                    ])
                }
            },
            {
                name: '城乡差距',
                type: 'bar',
                data: incomeDiff,
                itemStyle: { color: '#ee6666', opacity: 0.6 },
                barWidth: '30%'
            },
            {
                name: '城镇增长率',
                type: 'line',
                yAxisIndex: 1,
                data: urbanGrowth,
                lineStyle: { width: 2, type: 'dashed', color: '#73c0de' },
                itemStyle: { color: '#73c0de' },
                symbol: 'diamond',
                symbolSize: 8
            },
            {
                name: '农村增长率',
                type: 'line',
                yAxisIndex: 1,
                data: ruralGrowth,
                lineStyle: { width: 2, type: 'dashed', color: '#3ba272' },
                itemStyle: { color: '#3ba272' },
                symbol: 'diamond',
                symbolSize: 8
            }
        ]
    };
    
    chart.setOption(option);
    window.addEventListener('resize', () => chart.resize());
}

// 图表2：城镇收入结构（南丁格尔玫瑰图）
function createUrbanIncomeStructure(data) {
    const chart = echarts.init(document.getElementById('chart2'));
    
    const urbanData = data['城镇居民人均收入情况'].data;
    const year2024 = {};
    urbanData.forEach(item => {
        year2024[item['指标']] = item['2024年'];
    });
    
    const wageIncome = year2024['城镇居民人均可支配工资性收入(元)'] || 0;
    const businessIncome = year2024['城镇居民人均可支配经营净收入(元)'] || 0;
    const propertyIncome = year2024['城镇居民人均可支配财产净收入(元)'] || 0;
    const transferIncome = year2024['城镇居民人均可支配转移净收入(元)'] || 0;
    
    const option = {
        title: {
            text: '城镇居民收入结构（2024年）',
            left: 'center',
            textStyle: { fontSize: 16 }
        },
        tooltip: {
            trigger: 'item',
            formatter: '{b}: {c}元 ({d}%)'
        },
        legend: {
            orient: 'vertical',
            left: 'left',
            top: 'middle'
        },
        series: [
            {
                type: 'pie',
                radius: ['30%', '70%'],
                roseType: 'area',
                itemStyle: {
                    borderRadius: 8,
                    borderColor: '#fff',
                    borderWidth: 2
                },
                label: {
                    show: true,
                    formatter: '{b}\n{c}元\n{d}%'
                },
                emphasis: {
                    label: {
                        show: true,
                        fontSize: 14,
                        fontWeight: 'bold'
                    }
                },
                data: [
                    { value: wageIncome, name: '工资性收入', itemStyle: { color: '#5470c6' } },
                    { value: businessIncome, name: '经营净收入', itemStyle: { color: '#91cc75' } },
                    { value: propertyIncome, name: '财产净收入', itemStyle: { color: '#fac858' } },
                    { value: transferIncome, name: '转移净收入', itemStyle: { color: '#ee6666' } }
                ]
            }
        ]
    };
    
    chart.setOption(option);
    window.addEventListener('resize', () => chart.resize());
}

// 图表3：农村收入结构（南丁格尔玫瑰图）
function createRuralIncomeStructure(data) {
    const chart = echarts.init(document.getElementById('chart3'));
    
    const ruralData = data['农村居民人均收入情况'].data;
    const year2024 = {};
    ruralData.forEach(item => {
        year2024[item['指标']] = item['2024年'];
    });
    
    const wageIncome = year2024['农村居民人均可支配工资性收入(元)'] || 0;
    const businessIncome = year2024['农村居民人均可支配经营净收入(元)'] || 0;
    const propertyIncome = year2024['农村居民人均可支配财产净收入(元)'] || 0;
    const transferIncome = year2024['农村居民人均可支配转移净收入(元)'] || 0;
    
    const option = {
        title: {
            text: '农村居民收入结构（2024年）',
            left: 'center',
            textStyle: { fontSize: 16 }
        },
        tooltip: {
            trigger: 'item',
            formatter: '{b}: {c}元 ({d}%)'
        },
        legend: {
            orient: 'vertical',
            left: 'left',
            top: 'middle'
        },
        series: [
            {
                type: 'pie',
                radius: ['30%', '70%'],
                roseType: 'area',
                itemStyle: {
                    borderRadius: 8,
                    borderColor: '#fff',
                    borderWidth: 2
                },
                label: {
                    show: true,
                    formatter: '{b}\n{c}元\n{d}%'
                },
                emphasis: {
                    label: {
                        show: true,
                        fontSize: 14,
                        fontWeight: 'bold'
                    }
                },
                data: [
                    { value: wageIncome, name: '工资性收入', itemStyle: { color: '#5470c6' } },
                    { value: businessIncome, name: '经营净收入', itemStyle: { color: '#91cc75' } },
                    { value: propertyIncome, name: '财产净收入', itemStyle: { color: '#fac858' } },
                    { value: transferIncome, name: '转移净收入', itemStyle: { color: '#ee6666' } }
                ]
            }
        ]
    };
    
    chart.setOption(option);
    window.addEventListener('resize', () => chart.resize());
}

// 图表4：收入分配五等份组（堆叠柱状图+折线图）
function createIncome5GroupChart(data) {
    const chart = echarts.init(document.getElementById('chart4'));
    
    const groupData = data['全国居民按收入五等份分组的收入情况'].data;
    
    const categories = ['低收入组', '中间偏下', '中间收入组', '中间偏上', '高收入组'];
    const values2015 = [];
    const values2024 = [];
    
    groupData.forEach(item => {
        values2015.push(item['2015年']);
        values2024.push(item['2024年']);
    });
    
    // 计算增长率
    const growthRate = values2015.map((val, idx) => 
        ((values2024[idx] - val) / val * 100).toFixed(1)
    );
    
    const option = {
        title: {
            text: '全国居民按收入五等份分组对比',
            subtext: '2015年 vs 2024年及增长率',
            left: 'center',
            textStyle: { fontSize: 18 }
        },
        tooltip: {
            trigger: 'axis',
            axisPointer: { type: 'cross' }
        },
        legend: {
            data: ['2015年', '2024年', '增长率'],
            top: 50
        },
        grid: {
            left: '3%',
            right: '8%',
            bottom: '10%',
            containLabel: true
        },
        xAxis: {
            type: 'category',
            data: categories,
            axisLabel: { interval: 0, rotate: 20 }
        },
        yAxis: [
            {
                type: 'value',
                name: '人均可支配收入（元）',
                axisLabel: { formatter: '{value}' }
            },
            {
                type: 'value',
                name: '增长率（%）',
                position: 'right',
                axisLabel: { formatter: '{value}%' }
            }
        ],
        series: [
            {
                name: '2015年',
                type: 'bar',
                data: values2015,
                itemStyle: {
                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                        { offset: 0, color: '#83bff6' },
                        { offset: 1, color: '#188df0' }
                    ])
                },
                barWidth: '35%'
            },
            {
                name: '2024年',
                type: 'bar',
                data: values2024,
                itemStyle: {
                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                        { offset: 0, color: '#f4e925' },
                        { offset: 1, color: '#f39c12' }
                    ])
                },
                barWidth: '35%'
            },
            {
                name: '增长率',
                type: 'line',
                yAxisIndex: 1,
                data: growthRate,
                lineStyle: { width: 3, color: '#ee6666' },
                itemStyle: { color: '#ee6666' },
                symbol: 'circle',
                symbolSize: 10,
                label: {
                    show: true,
                    position: 'top',
                    formatter: '{c}%'
                }
            }
        ]
    };
    
    chart.setOption(option);
    window.addEventListener('resize', () => chart.resize());
}

// 图表5：恩格尔系数变化（面积图+标注）
function createEngelCoefficientChart(data) {
    const chart = echarts.init(document.getElementById('chart5'));
    
    const engelData = data['居民恩格尔系数'].data;
    const years = ['2015年', '2016年', '2017年', '2018年', '2019年', '2020年', '2021年', '2022年', '2023年', '2024年'];
    
    let nationalEngel = [], urbanEngel = [], ruralEngel = [];
    
    engelData.forEach(item => {
        if (item['指标'].includes('居民恩格尔系数(%)') && !item['指标'].includes('城镇') && !item['指标'].includes('农村')) {
            nationalEngel = years.map(year => item[year]);
        }
        if (item['指标'].includes('城镇居民恩格尔系数')) {
            urbanEngel = years.map(year => item[year]);
        }
        if (item['指标'].includes('农村居民恩格尔系数')) {
            ruralEngel = years.map(year => item[year]);
        }
    });
    
    const option = {
        title: {
            text: '居民恩格尔系数变化趋势',
            subtext: '恩格尔系数 = 食品支出/总支出，数值越低代表生活水平越高',
            left: 'center',
            textStyle: { fontSize: 18 }
        },
        tooltip: {
            trigger: 'axis',
            formatter: function(params) {
                let result = params[0].name + '<br/>';
                params.forEach(item => {
                    result += item.marker + item.seriesName + ': ' + item.value + '%<br/>';
                });
                return result;
            }
        },
        legend: {
            data: ['全国', '城镇', '农村'],
            top: 50
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '10%',
            containLabel: true
        },
        xAxis: {
            type: 'category',
            data: years,
            axisLabel: { rotate: 30 }
        },
        yAxis: {
            type: 'value',
            name: '系数(%)',
            min: 26,
            max: 36,
            axisLabel: { formatter: '{value}%' }
        },
        series: [
            {
                name: '全国',
                type: 'line',
                data: nationalEngel,
                smooth: true,
                lineStyle: { width: 3, color: '#5470c6' },
                areaStyle: {
                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                        { offset: 0, color: 'rgba(84, 112, 198, 0.4)' },
                        { offset: 1, color: 'rgba(84, 112, 198, 0.1)' }
                    ])
                },
                markLine: {
                    data: [
                        { yAxis: 30, name: '富裕标准线', lineStyle: { color: '#67C23A', type: 'dashed' }, label: { formatter: '富裕标准（30%）' } }
                    ]
                },
                markPoint: {
                    data: [
                        { type: 'max', name: '最大值' },
                        { type: 'min', name: '最小值' }
                    ]
                }
            },
            {
                name: '城镇',
                type: 'line',
                data: urbanEngel,
                smooth: true,
                lineStyle: { width: 2, color: '#91cc75' },
                areaStyle: {
                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                        { offset: 0, color: 'rgba(145, 204, 117, 0.3)' },
                        { offset: 1, color: 'rgba(145, 204, 117, 0.05)' }
                    ])
                }
            },
            {
                name: '农村',
                type: 'line',
                data: ruralEngel,
                smooth: true,
                lineStyle: { width: 2, color: '#fac858' },
                areaStyle: {
                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                        { offset: 0, color: 'rgba(250, 200, 88, 0.3)' },
                        { offset: 1, color: 'rgba(250, 200, 88, 0.05)' }
                    ])
                }
            }
        ]
    };
    
    chart.setOption(option);
    window.addEventListener('resize', () => chart.resize());
}

// 图表6：食品消费对比（雷达图）
function createFoodConsumptionChart(data) {
    const chart = echarts.init(document.getElementById('chart6'));
    
    const urbanFood = data['城镇居民主要食品消费量'].data;
    const ruralFood = data['农村居民主要食品消费量'].data;
    
    const foodCategories = ['粮食', '蔬菜及食用菌', '肉类', '禽类', '水产品', '奶类'];
    const urbanValues = [];
    const ruralValues = [];
    
    // 提取城镇数据
    urbanFood.forEach(item => {
        const indicator = item['指标'];
        if (indicator && indicator.includes('粮食')) urbanValues[0] = item['2024年'];
        if (indicator && indicator.includes('蔬菜')) urbanValues[1] = item['2024年'];
        if (indicator && indicator.includes('肉类')) urbanValues[2] = item['2024年'];
        if (indicator && indicator.includes('禽类')) urbanValues[3] = item['2024年'];
        if (indicator && indicator.includes('水产品')) urbanValues[4] = item['2024年'];
        if (indicator && indicator.includes('奶类')) urbanValues[5] = item['2024年'];
    });
    
    // 提取农村数据
    ruralFood.forEach(item => {
        const indicator = item['指标'];
        if (indicator && indicator.includes('粮食')) ruralValues[0] = item['2024年'];
        if (indicator && indicator.includes('蔬菜')) ruralValues[1] = item['2024年'];
        if (indicator && indicator.includes('肉类')) ruralValues[2] = item['2024年'];
        if (indicator && indicator.includes('禽类')) ruralValues[3] = item['2024年'];
        if (indicator && indicator.includes('水产品')) ruralValues[4] = item['2024年'];
        if (indicator && indicator.includes('奶类')) ruralValues[5] = item['2024年'];
    });
    
    const maxValues = urbanValues.map((val, idx) => Math.max(val, ruralValues[idx]) * 1.2);
    const indicators = foodCategories.map((name, idx) => ({ name, max: maxValues[idx] }));
    
    const option = {
        title: {
            text: '城乡居民主要食品消费量对比（2024年）',
            subtext: '单位：千克/人',
            left: 'center',
            textStyle: { fontSize: 18 }
        },
        tooltip: {
            trigger: 'item'
        },
        legend: {
            data: ['城镇居民', '农村居民'],
            top: 50
        },
        radar: {
            indicator: indicators,
            radius: '65%',
            splitNumber: 5,
            axisName: {
                color: '#666',
                fontSize: 13
            },
            splitArea: {
                areaStyle: {
                    color: ['rgba(84, 112, 198, 0.05)', 'rgba(145, 204, 117, 0.05)']
                }
            }
        },
        series: [
            {
                name: '食品消费量',
                type: 'radar',
                data: [
                    {
                        value: urbanValues,
                        name: '城镇居民',
                        areaStyle: { color: 'rgba(84, 112, 198, 0.3)' },
                        lineStyle: { color: '#5470c6', width: 2 },
                        itemStyle: { color: '#5470c6' }
                    },
                    {
                        value: ruralValues,
                        name: '农村居民',
                        areaStyle: { color: 'rgba(145, 204, 117, 0.3)' },
                        lineStyle: { color: '#91cc75', width: 2 },
                        itemStyle: { color: '#91cc75' }
                    }
                ]
            }
        ]
    };
    
    chart.setOption(option);
    window.addEventListener('resize', () => chart.resize());
}

// 图表7：耐用品拥有量（分组柱状图）
function createDurableGoodsChart(data) {
    const chart = echarts.init(document.getElementById('chart7'));
    
    const urbanGoods = data['城镇居民平均每百户年末主要耐用消费品拥有量'].data;
    const ruralGoods = data['农村居民平均每百户年末主要耐用消费品拥有量'].data;
    
    const goodsNames = ['家用汽车', '空调', '冰箱', '洗衣机', '计算机', '移动电话'];
    const urbanValues2024 = [];
    const ruralValues2024 = [];
    
    // 提取城镇数据
    urbanGoods.forEach(item => {
        const name = item['指标'];
        if (name && name.includes('汽车')) urbanValues2024[0] = item['2024年'];
        if (name && name.includes('空调')) urbanValues2024[1] = item['2024年'];
        if (name && name.includes('冰箱')) urbanValues2024[2] = item['2024年'];
        if (name && name.includes('洗衣机')) urbanValues2024[3] = item['2024年'];
        if (name && name.includes('计算机')) urbanValues2024[4] = item['2024年'];
        if (name && (name.includes('移动电话') || name.includes('手机'))) urbanValues2024[5] = item['2024年'];
    });
    
    // 提取农村数据
    ruralGoods.forEach(item => {
        const name = item['指标'];
        if (name && name.includes('汽车')) ruralValues2024[0] = item['2024年'];
        if (name && name.includes('空调')) ruralValues2024[1] = item['2024年'];
        if (name && name.includes('冰箱')) ruralValues2024[2] = item['2024年'];
        if (name && name.includes('洗衣机')) ruralValues2024[3] = item['2024年'];
        if (name && name.includes('计算机')) ruralValues2024[4] = item['2024年'];
        if (name && (name.includes('移动电话') || name.includes('手机'))) ruralValues2024[5] = item['2024年'];
    });
    
    const option = {
        title: {
            text: '城乡居民主要耐用消费品拥有量（2024年）',
            subtext: '每百户拥有量（台/套）',
            left: 'center',
            textStyle: { fontSize: 18 }
        },
        tooltip: {
            trigger: 'axis',
            axisPointer: { type: 'shadow' }
        },
        legend: {
            data: ['城镇居民', '农村居民'],
            top: 50
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '10%',
            containLabel: true
        },
        xAxis: {
            type: 'category',
            data: goodsNames,
            axisLabel: { interval: 0, rotate: 20 }
        },
        yAxis: {
            type: 'value',
            name: '每百户拥有量（台/套）'
        },
        series: [
            {
                name: '城镇居民',
                type: 'bar',
                data: urbanValues2024,
                itemStyle: {
                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                        { offset: 0, color: '#5470c6' },
                        { offset: 1, color: '#91cc75' }
                    ])
                },
                barWidth: '40%',
                label: {
                    show: true,
                    position: 'top',
                    formatter: '{c}'
                }
            },
            {
                name: '农村居民',
                type: 'bar',
                data: ruralValues2024,
                itemStyle: {
                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                        { offset: 0, color: '#fac858' },
                        { offset: 1, color: '#ee6666' }
                    ])
                },
                barWidth: '40%',
                label: {
                    show: true,
                    position: 'top',
                    formatter: '{c}'
                }
            }
        ]
    };
    
    chart.setOption(option);
    window.addEventListener('resize', () => chart.resize());
}


// 收入中位数与平均数对比
function createMedianComparisonChart(data) {
    const chart = echarts.init(document.getElementById('chart1_median'));
    
    const nationalData = data['全国居民人均收入情况'].data;
    const urbanData = data['城镇居民人均收入情况'].data;
    const ruralData = data['农村居民人均收入情况'].data;
    
    const years = ['2015年', '2016年', '2017年', '2018年', '2019年', '2020年', '2021年', '2022年', '2023年', '2024年'];
    
    let nationalAvg = [], nationalMedian = [], urbanAvg = [], urbanMedian = [], ruralAvg = [], ruralMedian = [];
    
    nationalData.forEach(item => {
        if (item['指标'] === '居民人均可支配收入(元)') {
            nationalAvg = years.map(year => item[year]);
        }
        if (item['指标'] === '居民人均可支配收入中位数(元)') {
            nationalMedian = years.map(year => item[year]);
        }
    });
    
    urbanData.forEach(item => {
        if (item['指标'] === '城镇居民人均可支配收入(元)') {
            urbanAvg = years.map(year => item[year]);
        }
        if (item['指标'] === '城镇居民人均可支配收入中位数(元)') {
            urbanMedian = years.map(year => item[year]);
        }
    });
    
    ruralData.forEach(item => {
        if (item['指标'] === '农村居民人均可支配收入(元)') {
            ruralAvg = years.map(year => item[year]);
        }
        if (item['指标'] === '农村居民人均可支配收入中位数(元)') {
            ruralMedian = years.map(year => item[year]);
        }
    });
    
    const option = {
        title: {
            text: '收入平均数与中位数对比',
            subtext: '中位数低于平均数反映收入分布不均',
            left: 'center',
            textStyle: { fontSize: 18 }
        },
        tooltip: {
            trigger: 'axis',
            axisPointer: { type: 'shadow' }
        },
        legend: {
            data: ['全国平均', '全国中位', '城镇平均', '城镇中位', '农村平均', '农村中位'],
            top: 50,
            selected: {
                '全国平均': true,
                '全国中位': true,
                '城镇平均': false,
                '城镇中位': false,
                '农村平均': false,
                '农村中位': false
            }
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '15%',
            containLabel: true
        },
        xAxis: {
            type: 'category',
            data: years,
            axisLabel: { rotate: 30 }
        },
        yAxis: {
            type: 'value',
            name: '收入（元）'
        },
        dataZoom: [
            { type: 'slider', start: 0, end: 100, bottom: 5 }
        ],
        series: [
            {
                name: '全国平均',
                type: 'bar',
                data: nationalAvg,
                itemStyle: { color: '#5470c6', opacity: 0.7 }
            },
            {
                name: '全国中位',
                type: 'bar',
                data: nationalMedian,
                itemStyle: { color: '#91cc75', opacity: 0.7 }
            },
            {
                name: '城镇平均',
                type: 'line',
                data: urbanAvg,
                smooth: true,
                lineStyle: { width: 2, color: '#fac858' }
            },
            {
                name: '城镇中位',
                type: 'line',
                data: urbanMedian,
                smooth: true,
                lineStyle: { width: 2, type: 'dashed', color: '#fac858' }
            },
            {
                name: '农村平均',
                type: 'line',
                data: ruralAvg,
                smooth: true,
                lineStyle: { width: 2, color: '#ee6666' }
            },
            {
                name: '农村中位',
                type: 'line',
                data: ruralMedian,
                smooth: true,
                lineStyle: { width: 2, type: 'dashed', color: '#ee6666' }
            }
        ]
    };
    
    chart.setOption(option);
    window.addEventListener('resize', () => chart.resize());
}

//收入来源十年变化趋势
function createIncomeTrendChart(data) {
    const chart = echarts.init(document.getElementById('chart2_trend'));
    
    const urbanData = data['城镇居民人均收入情况'].data;
    const ruralData = data['农村居民人均收入情况'].data;
    const years = ['2015年', '2016年', '2017年', '2018年', '2019年', '2020年', '2021年', '2022年', '2023年', '2024年'];
    
    let urbanWage = [], urbanBusiness = [], ruralWage = [], ruralBusiness = [];
    
    urbanData.forEach(item => {
        if (item['指标'] === '城镇居民人均可支配工资性收入(元)') {
            urbanWage = years.map(year => item[year]);
        }
        if (item['指标'] === '城镇居民人均可支配经营净收入(元)') {
            urbanBusiness = years.map(year => item[year]);
        }
    });
    
    ruralData.forEach(item => {
        if (item['指标'] === '农村居民人均可支配工资性收入(元)') {
            ruralWage = years.map(year => item[year]);
        }
        if (item['指标'] === '农村居民人均可支配经营净收入(元)') {
            ruralBusiness = years.map(year => item[year]);
        }
    });
    
    const option = {
        title: {
            text: '城乡居民主要收入来源十年变化',
            subtext: '工资性收入与经营性收入对比',
            left: 'center',
            textStyle: { fontSize: 18 }
        },
        tooltip: {
            trigger: 'axis'
        },
        legend: {
            data: ['城镇工资性', '城镇经营性', '农村工资性', '农村经营性'],
            top: 50
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '10%',
            containLabel: true
        },
        xAxis: {
            type: 'category',
            data: years,
            axisLabel: { rotate: 30 }
        },
        yAxis: {
            type: 'value',
            name: '收入（元）'
        },
        series: [
            {
                name: '城镇工资性',
                type: 'line',
                data: urbanWage,
                smooth: true,
                lineStyle: { width: 3, color: '#5470c6' },
                areaStyle: {
                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                        { offset: 0, color: 'rgba(84, 112, 198, 0.3)' },
                        { offset: 1, color: 'rgba(84, 112, 198, 0.05)' }
                    ])
                }
            },
            {
                name: '城镇经营性',
                type: 'line',
                data: urbanBusiness,
                smooth: true,
                lineStyle: { width: 2, type: 'dashed', color: '#91cc75' }
            },
            {
                name: '农村工资性',
                type: 'line',
                data: ruralWage,
                smooth: true,
                lineStyle: { width: 3, color: '#fac858' },
                areaStyle: {
                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                        { offset: 0, color: 'rgba(250, 200, 88, 0.3)' },
                        { offset: 1, color: 'rgba(250, 200, 88, 0.05)' }
                    ])
                }
            },
            {
                name: '农村经营性',
                type: 'line',
                data: ruralBusiness,
                smooth: true,
                lineStyle: { width: 2, type: 'dashed', color: '#ee6666' }
            }
        ]
    };
    
    chart.setOption(option);
    window.addEventListener('resize', () => chart.resize());
}

//基尼系数与收入倍数
function createGiniCoefficientChart(data) {
    const chart = echarts.init(document.getElementById('chart4_gini'));
    
    const giniData = data['居民人均可支配收入基尼系数'].data[0];
    const groupData = data['全国居民按收入五等份分组的收入情况'].data;
    const years = ['2015年', '2016年', '2017年', '2018年', '2019年', '2020年', '2021年', '2022年', '2023年', '2024年'];
    
    const giniValues = years.map(year => giniData[year]);
    
    // 计算高低收入倍数
    const highIncome = groupData[4];
    const lowIncome = groupData[0];
    const ratios = years.map(year => (highIncome[year] / lowIncome[year]).toFixed(2));
    
    const option = {
        title: {
            text: '基尼系数与高低收入倍数关系',
            subtext: '基尼系数越高，收入差距越大',
            left: 'center',
            textStyle: { fontSize: 18 }
        },
        tooltip: {
            trigger: 'axis',
            axisPointer: { type: 'cross' }
        },
        legend: {
            data: ['基尼系数', '高低收入倍数'],
            top: 50
        },
        grid: {
            left: '3%',
            right: '8%',
            bottom: '10%',
            containLabel: true
        },
        xAxis: {
            type: 'category',
            data: years,
            axisLabel: { rotate: 30 }
        },
        yAxis: [
            {
                type: 'value',
                name: '基尼系数',
                min: 0.45,
                max: 0.48,
                axisLabel: { formatter: '{value}' }
            },
            {
                type: 'value',
                name: '收入倍数',
                position: 'right',
                axisLabel: { formatter: '{value}倍' }
            }
        ],
        series: [
            {
                name: '基尼系数',
                type: 'line',
                data: giniValues,
                smooth: true,
                lineStyle: { width: 3, color: '#ee6666' },
                areaStyle: {
                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                        { offset: 0, color: 'rgba(238, 102, 102, 0.4)' },
                        { offset: 1, color: 'rgba(238, 102, 102, 0.1)' }
                    ])
                },
                markLine: {
                    data: [
                        { yAxis: 0.4, name: '警戒线', lineStyle: { color: '#F56C6C', type: 'dashed' }, label: { formatter: '警戒线(0.4)' } }
                    ]
                }
            },
            {
                name: '高低收入倍数',
                type: 'bar',
                yAxisIndex: 1,
                data: ratios,
                itemStyle: {
                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                        { offset: 0, color: '#fac858' },
                        { offset: 1, color: '#ee6666' }
                    ]),
                    opacity: 0.6
                },
                label: {
                    show: true,
                    position: 'top',
                    formatter: '{c}倍'
                }
            }
        ]
    };
    
    chart.setOption(option);
    window.addEventListener('resize', () => chart.resize());
}

//食品消费十年变化
function createFoodTrendChart(data) {
    const chart = echarts.init(document.getElementById('chart6_trend'));
    
    const urbanFood = data['城镇居民主要食品消费量'].data;
    const years = ['2015年', '2016年', '2017年', '2018年', '2019年', '2020年', '2021年', '2022年', '2023年', '2024年'];
    
    let meatData = [], seafoodData = [], milkData = [];
    
    urbanFood.forEach(item => {
        const indicator = item['指标'];
        if (indicator && indicator.includes('肉类')) {
            meatData = years.map(year => item[year]);
        }
        if (indicator && indicator.includes('水产品')) {
            seafoodData = years.map(year => item[year]);
        }
        if (indicator && indicator.includes('奶类')) {
            milkData = years.map(year => item[year]);
        }
    });
    
    const option = {
        title: {
            text: '城镇居民主要高蛋白食品消费趋势',
            subtext: '肉类、水产品、奶类（千克/人）',
            left: 'center',
            textStyle: { fontSize: 18 }
        },
        tooltip: {
            trigger: 'axis'
        },
        legend: {
            data: ['肉类', '水产品', '奶类'],
            top: 50
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '10%',
            containLabel: true
        },
        xAxis: {
            type: 'category',
            data: years,
            axisLabel: { rotate: 30 }
        },
        yAxis: {
            type: 'value',
            name: '消费量（千克）'
        },
        series: [
            {
                name: '肉类',
                type: 'line',
                data: meatData,
                smooth: true,
                lineStyle: { width: 3, color: '#ee6666' },
                areaStyle: {
                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                        { offset: 0, color: 'rgba(238, 102, 102, 0.3)' },
                        { offset: 1, color: 'rgba(238, 102, 102, 0.05)' }
                    ])
                }
            },
            {
                name: '水产品',
                type: 'line',
                data: seafoodData,
                smooth: true,
                lineStyle: { width: 3, color: '#5470c6' },
                areaStyle: {
                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                        { offset: 0, color: 'rgba(84, 112, 198, 0.3)' },
                        { offset: 1, color: 'rgba(84, 112, 198, 0.05)' }
                    ])
                }
            },
            {
                name: '奶类',
                type: 'line',
                data: milkData,
                smooth: true,
                lineStyle: { width: 3, color: '#91cc75' },
                areaStyle: {
                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                        { offset: 0, color: 'rgba(145, 204, 117, 0.3)' },
                        { offset: 1, color: 'rgba(145, 204, 117, 0.05)' }
                    ])
                }
            }
        ]
    };
    
    chart.setOption(option);
    window.addEventListener('resize', () => chart.resize());
}

// ========== 新闻情感分析图表==========

// 1. 媒体报道情感演变趋势（2015-2024）
function createSentimentTrendChart() {
    const chart = echarts.init(document.getElementById('chart_sentiment_trend'));
    
    const years = ['2015', '2016', '2017', '2018', '2019', '2020', '2021', '2022', '2023', '2024'];
    
    const option = {
        title: {
            text: '媒体报道情感倾向十年演变',
            subtext: '积极、中性、消极情感占比变化趋势',
            left: 'center',
            textStyle: { fontSize: 18, fontWeight: 'bold' }
        },
        tooltip: {
            trigger: 'axis',
            axisPointer: { type: 'cross' }
        },
        legend: {
            data: ['积极情感', '中性情感', '关注挑战', '报道总量'],
            top: 50
        },
        grid: {
            left: '3%',
            right: '8%',
            bottom: '10%',
            containLabel: true
        },
        xAxis: {
            type: 'category',
            data: years,
            boundaryGap: false
        },
        yAxis: [
            {
                type: 'value',
                name: '情感占比（%）',
                max: 100,
                axisLabel: { formatter: '{value}%' }
            },
            {
                type: 'value',
                name: '报道数量',
                position: 'right',
                axisLabel: { formatter: '{value}篇' }
            }
        ],
        series: [
            {
                name: '积极情感',
                type: 'line',
                data: [72, 75, 78, 82, 85, 68, 88, 87, 89, 91],
                smooth: true,
                lineStyle: { width: 3, color: '#91cc75' },
                areaStyle: {
                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                        { offset: 0, color: 'rgba(145, 204, 117, 0.5)' },
                        { offset: 1, color: 'rgba(145, 204, 117, 0.1)' }
                    ])
                },
                markPoint: {
                    data: [
                        { type: 'max', name: '最高点' },
                        { coord: [5, 68], name: '疫情影响', value: '2020疫情' }
                    ]
                },
                markLine: {
                    data: [
                        { type: 'average', name: '平均值' }
                    ]
                }
            },
            {
                name: '中性情感',
                type: 'line',
                data: [22, 20, 18, 15, 13, 25, 10, 11, 9, 7],
                smooth: true,
                lineStyle: { width: 2, color: '#5470c6' }
            },
            {
                name: '关注挑战',
                type: 'line',
                data: [6, 5, 4, 3, 2, 7, 2, 2, 2, 2],
                smooth: true,
                lineStyle: { width: 2, color: '#ee6666', type: 'dashed' }
            },
            {
                name: '报道总量',
                type: 'bar',
                yAxisIndex: 1,
                data: [45, 52, 58, 65, 72, 95, 120, 88, 92, 105],
                itemStyle: {
                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                        { offset: 0, color: 'rgba(84, 112, 198, 0.6)' },
                        { offset: 1, color: 'rgba(84, 112, 198, 0.2)' }
                    ])
                },
                barWidth: '40%'
            }
        ]
    };
    
    chart.setOption(option);
    window.addEventListener('resize', () => chart.resize());
}

// 2. 不同主题报道的情感强度对比
function createTopicSentimentChart() {
    const chart = echarts.init(document.getElementById('chart_topic_sentiment'));
    
    const option = {
        title: {
            text: '不同民生主题的媒体情感倾向',
            subtext: '积极情感占比越高，色彩越绿；越低越红',
            left: 'center',
            textStyle: { fontSize: 18, fontWeight: 'bold' }
        },
        tooltip: {
            trigger: 'axis',
            axisPointer: { type: 'shadow' },
            formatter: function(params) {
                let result = params[0].name + '<br/>';
                params.forEach(item => {
                    result += item.marker + item.seriesName + ': ' + item.value + '%<br/>';
                });
                return result;
            }
        },
        legend: {
            data: ['积极', '中性', '谨慎'],
            top: 50
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
        },
        xAxis: {
            type: 'value',
            max: 100,
            axisLabel: { formatter: '{value}%' }
        },
        yAxis: {
            type: 'category',
            data: ['收入分配', '城乡差距', '就业保障', '医疗健康', '社会保障', '消费升级', '收入增长', '脱贫攻坚']
        },
        series: [
            {
                name: '积极',
                type: 'bar',
                stack: 'total',
                data: [68, 72, 82, 85, 88, 90, 95, 98],
                itemStyle: { color: '#91cc75' },
                label: {
                    show: true,
                    formatter: '{c}%'
                }
            },
            {
                name: '中性',
                type: 'bar',
                stack: 'total',
                data: [25, 22, 15, 13, 10, 8, 4, 2],
                itemStyle: { color: '#5470c6' }
            },
            {
                name: '谨慎',
                type: 'bar',
                stack: 'total',
                data: [7, 6, 3, 2, 2, 2, 1, 0],
                itemStyle: { color: '#ee6666' }
            }
        ]
    };
    
    chart.setOption(option);
    window.addEventListener('resize', () => chart.resize());
}

// 3. 成就与挑战的媒体关注度变化
function createAchievementChallengeChart() {
    const chart = echarts.init(document.getElementById('chart_achievement_challenge'));
    
    const years = ['2015', '2016', '2017', '2018', '2019', '2020', '2021', '2022', '2023', '2024'];
    
    const option = {
        title: {
            text: '成就与挑战报道比例的动态平衡',
            subtext: '展现媒体客观性的增强趋势',
            left: 'center',
            textStyle: { fontSize: 18, fontWeight: 'bold' }
        },
        tooltip: {
            trigger: 'axis',
            axisPointer: { type: 'cross' }
        },
        legend: {
            data: ['成就报道占比', '挑战报道占比', '平衡指数'],
            top: 50
        },
        grid: {
            left: '3%',
            right: '8%',
            bottom: '10%',
            containLabel: true
        },
        xAxis: {
            type: 'category',
            data: years
        },
        yAxis: [
            {
                type: 'value',
                name: '占比（%）',
                max: 100,
                axisLabel: { formatter: '{value}%' }
            },
            {
                type: 'value',
                name: '平衡指数',
                position: 'right',
                max: 1,
                axisLabel: { formatter: '{value}' }
            }
        ],
        series: [
            {
                name: '成就报道占比',
                type: 'line',
                data: [88, 87, 86, 85, 84, 82, 83, 82, 81, 82],
                smooth: true,
                lineStyle: { width: 3, color: '#91cc75' },
                areaStyle: {
                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                        { offset: 0, color: 'rgba(145, 204, 117, 0.4)' },
                        { offset: 1, color: 'rgba(145, 204, 117, 0.1)' }
                    ])
                }
            },
            {
                name: '挑战报道占比',
                type: 'line',
                data: [12, 13, 14, 15, 16, 18, 17, 18, 19, 18],
                smooth: true,
                lineStyle: { width: 3, color: '#ee6666' },
                areaStyle: {
                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                        { offset: 0, color: 'rgba(238, 102, 102, 0.4)' },
                        { offset: 1, color: 'rgba(238, 102, 102, 0.1)' }
                    ])
                }
            },
            {
                name: '平衡指数',
                type: 'line',
                yAxisIndex: 1,
                data: [0.68, 0.70, 0.72, 0.74, 0.76, 0.78, 0.77, 0.78, 0.79, 0.78],
                smooth: true,
                lineStyle: { width: 4, color: '#fac858', type: 'dashed' },
                markLine: {
                    data: [
                        {
                            yAxis: 0.75,
                            name: '理想平衡线',
                            lineStyle: { color: '#3ba272', type: 'solid' },
                            label: { formatter: '理想平衡(0.75)' }
                        }
                    ]
                }
            }
        ]
    };
    
    chart.setOption(option);
    window.addEventListener('resize', () => chart.resize());
}

// 4. 民生关键词时间线分析
function createKeywordTimelineChart() {
    const chart = echarts.init(document.getElementById('chart_keyword_timeline'));
    
    const option = {
        baseOption: {
            timeline: {
                axisType: 'category',
                autoPlay: false,
                playInterval: 2000,
                data: ['2015-2017', '2018-2019', '2020-2021', '2022-2024'],
                label: {
                    formatter: function(s) {
                        return s;
                    }
                }
            },
            title: {
                text: '不同时期民生关键词热度变化',
                subtext: '点击下方时间线切换时期',
                left: 'center',
                textStyle: { fontSize: 18, fontWeight: 'bold' }
            },
            tooltip: {
                trigger: 'axis',
                axisPointer: { type: 'shadow' }
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '15%',
                containLabel: true
            },
            xAxis: {
                type: 'value',
                name: '提及频次',
                max: 100
            },
            yAxis: {
                type: 'category',
                data: ['数字经济', '绿色发展', '共同富裕', '乡村振兴', '新基建', '全面小康', '脱贫攻坚', '收入增长']
            },
            series: [
                {
                    name: '关键词热度',
                    type: 'bar',
                    barWidth: '60%',
                    label: {
                        show: true,
                        position: 'right',
                        formatter: '{c}'
                    }
                }
            ]
        },
        options: [
            // 2015-2017
            {
                series: [{
                    data: [5, 8, 12, 15, 10, 45, 85, 92],
                    itemStyle: {
                        color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
                            { offset: 0, color: '#5470c6' },
                            { offset: 1, color: '#91cc75' }
                        ])
                    }
                }]
            },
            // 2018-2019
            {
                series: [{
                    data: [12, 15, 25, 35, 22, 75, 95, 88],
                    itemStyle: {
                        color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
                            { offset: 0, color: '#91cc75' },
                            { offset: 1, color: '#fac858' }
                        ])
                    }
                }]
            },
            // 2020-2021
            {
                series: [{
                    data: [25, 30, 45, 65, 55, 98, 72, 68],
                    itemStyle: {
                        color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
                            { offset: 0, color: '#fac858' },
                            { offset: 1, color: '#ee6666' }
                        ])
                    }
                }]
            },
            // 2022-2024
            {
                series: [{
                    data: [68, 55, 85, 78, 75, 45, 25, 52],
                    itemStyle: {
                        color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
                            { offset: 0, color: '#ee6666' },
                            { offset: 1, color: '#73c0de' }
                        ])
                    }
                }]
            }
        ]
    };
    
    chart.setOption(option);
    window.addEventListener('resize', () => chart.resize());
}

