from django.shortcuts import render
from .models import Book, Borrow

# Create your views here.
class Book():

    def post(self, request, *args, **kwargs):
        form = 




if request.method == 'POST':
        form = OrderForm(request.POST)
        if form.is_valid():
            form.save()
            return redirect('show_url')
    template_name = 'crudapp/order.html'
    context = {'form': form}
    return render(request, template_name, context)
