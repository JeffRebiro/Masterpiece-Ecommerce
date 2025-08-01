# Generated by Django 5.2.1 on 2025-06-16 08:19

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('megamall', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='HireItem',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=255)),
                ('image', models.ImageField(upload_to='hire_items/')),
                ('hire_price_per_hour', models.DecimalField(decimal_places=2, max_digits=10)),
                ('hire_price_per_day', models.DecimalField(decimal_places=2, max_digits=10)),
            ],
        ),
    ]
