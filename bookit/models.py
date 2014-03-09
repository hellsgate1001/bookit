from django.db import models


class BookitModel(models.Model):
    request = None

    def delete(self):
        if hasattr(self, 'active'):
            self.active = False
            self.save()
        else:
            super(BookitModel, self).delete()

    class Meta:
        abstract = True
