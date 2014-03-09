from django.db import models
from django.utils import timezone


class BookitModel(models.Model):
    request = None

    def delete(self):
        if hasattr(self, 'is_active'):
            self.is_active = False
            if hasattr(self, 'deleted_by'):
                self.deleted_by = self.request.user
            if hasattr(self, 'date_deleted'):
                date_deleted = timezone.datetime.now()
            self.save()
        else:
            super(BookitModel, self).delete()

    class Meta:
        abstract = True
