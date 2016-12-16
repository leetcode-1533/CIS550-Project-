import pywikibot

from pywikibot import pagegenerators as pg

def list_template_usage(site_obj, tmpl_name):
    """
    Takes Site object and template name and returns a generator.

    The function expects a Site object (pywikibot.Site()) and
    a template name (String). It creates a list of all
    pages using that template and returns them as a generator.
    The generator will load 50 pages at a time for iteration.
    """
    name = "{}:{}".format(site_obj.namespace(10), tmpl_name)
    tmpl_page = pywikibot.Page(site_obj, name)
    ref_gen = pg.ReferringPageGenerator(tmpl_page, onlyTemplateInclusion=True)
    filter_gen = pg.NamespaceFilterPageGenerator(ref_gen, namespaces=[0])
    generator = site_obj.preloadpages(filter_gen, pageprops=True)
    return generator

site = pywikibot.Site("en", 'wikipedia')
tmpl_gen = list_template_usage(site, "Infobox meteorite")

for page in tmpl_gen:
    item = pywikibot.ItemPage.fromPage(page)
    print(page.title(), item.getID())