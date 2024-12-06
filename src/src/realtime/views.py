from django.shortcuts import render

from .models import SalesByCardType, SalesByCountry
from django.http import JsonResponse

# Create your views here.


def index(request):

    return render(request, 'base.html', context={'text': 'Hello World!!!'})


def get_filter_options(request):
    options = ['CardType', 'Country']

    return JsonResponse({
        'options': options,
    })


colorPalette = ['#6fef55', '#81acec', '#9bc9fe', '#ffd9a7', '#fadda0', '#9a75ff', '#de79fd']
colorPrimary, colorSuccess, colorDanger = '#79c8c1', colorPalette[0], colorPalette[5]


def generate_color_palette(amount):
    palette = []

    i = 0
    while i < len(colorPalette) and len(palette) < amount:
        palette.append(colorPalette[i])
        i += 1
        if i == len(colorPalette) and len(palette) < amount:
            i = 0

    return palette


def salesby_realtime(request, salesby):
    labels = []
    sales_data = []

    if salesby == 'CardType':
        max_batch_no = SalesByCardType.objects.values('batch_no').order_by('-batch_no').first()
        print("Printing max_batch_no: ")
        print(max_batch_no)
        print(max_batch_no['batch_no'])
        queryset = SalesByCardType.objects.all().filter(batch_no=max_batch_no['batch_no'])

        for salesByCardType in queryset:
            labels.append(salesByCardType.card_type)
            sales_data.append(salesByCardType.total_sales)

    elif salesby == 'Country':
        max_batch_no = SalesByCountry.objects.values('batch_no').order_by('-batch_no').first()
        print("Printing max_batch_no: ")
        print(max_batch_no)
        print(max_batch_no['batch_no'])
        queryset = SalesByCountry.objects.all().filter(batch_no=max_batch_no['batch_no'])

        for salesByCountry in queryset:
            labels.append(salesByCountry.country)
            sales_data.append(salesByCountry.total_sales)

    return JsonResponse({
        'title': f'Sales by {salesby}',
        'data': {
            'labels': labels,
            'datasets': [{
                'label': 'Amount ($)',
                'backgroundColor': generate_color_palette(len(labels)),
                'borderColor': generate_color_palette(len(labels)),
                'data': sales_data,
            }]
        },
    })