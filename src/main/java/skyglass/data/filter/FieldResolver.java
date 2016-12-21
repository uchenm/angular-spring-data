package skyglass.data.filter;

import java.util.HashSet;
import java.util.LinkedHashSet;
import java.util.Set;

import skyglass.data.filter.api.AbstractFilterSpecification;

public class FieldResolver {
	
	private String fieldName;
	
	private Set<String> defaultResolvers = new HashSet<String>();
	
	private Set<String> fieldResolvers = new LinkedHashSet<String>();
	
	private FieldType fieldType;
	
	private CustomFieldResolver customFieldResolver;		
	
	public FieldResolver(String fieldName, FieldType fieldType, String... fieldResolvers) {
		this.fieldName = fieldName;
		this.defaultResolvers.add(AbstractFilterSpecification.normalizeFieldName(fieldName));
		for (String fieldResolver: fieldResolvers) {
			this.fieldResolvers.add(fieldResolver);				
		}
		if (fieldType != null) {
			this.fieldType = fieldType;			
		}
	}
	
	public FieldResolver(String fieldName, CustomFieldResolver customFieldResolver) {
		this(fieldName, FieldType.Criteria);
		this.customFieldResolver = customFieldResolver;
	}	
	
	public String getFieldName() {
		return fieldName;
	}
	
	public boolean isMultiple() {
		return getResolvers().size() > 1;
	}
	
	public boolean isSingle() {
		return getResolvers().size() == 1;
	}
	
	public FieldType getFieldType() {
		return fieldType;
	}
	
	public void setFieldType(FieldType fieldType) {
		this.fieldType = fieldType;
	}
	
	public String getResolver() {
		for (String fieldResolver: getResolvers()) {
			return fieldResolver;
		}
		return null;
	}
	
	public Set<String> getResolvers() {
		if (fieldResolvers.size() == 0) {
			return defaultResolvers;
		}
		return fieldResolvers;
	}
	
	public void addResolvers(String... resolvers) {
		for (String resolver: resolvers) {
			fieldResolvers.add(AbstractFilterSpecification.normalizeFieldName(resolver));			
		}
	}
	
	public CustomFieldResolver getCustomFieldResolver() {
		return customFieldResolver;
	}
	
	public void setCustomFieldResolver(CustomFieldResolver customFieldResolver) {
		this.customFieldResolver = customFieldResolver;
	}		
	
}	