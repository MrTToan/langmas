# Generated by Django 5.2.2 on 2025-06-08 16:11

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Word',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('word', models.CharField(max_length=100)),
                ('definition', models.TextField()),
            ],
        ),
        migrations.CreateModel(
            name='UserWordProgress',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('attempts', models.IntegerField(default=0)),
                ('correct', models.IntegerField(default=0)),
                ('learned', models.BooleanField(default=False)),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
                ('word', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='vocabulary.word')),
            ],
        ),
    ]
