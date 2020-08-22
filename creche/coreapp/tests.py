from django.test import TestCase
from coreapp.service.principal_service import PrincipalService
# Create your tests here.
class PrincipalServiceTestCase(TestCase):
    principal = PrincipalService()
    def test_save_principal(self):
        """Testing principal saving process"""
        nadia = {
			'principal_names': "Nadia Mb.",
			'telephone': '0778856565',
			'id_number': '5',
			'role': 'Directrice',
			'full_address' : 'Louvain 789ST',
			'email': '',
			};
        self.assertEqual(self.principal.save_principal(nadia),True);